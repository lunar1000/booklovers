import admin from 'firebase-admin';
import { db } from './firebase.server';
import { saveFileToBucket } from './firestorage.server';
import { PAGE_SIZE } from '$env/static/private';

export async function addBook(book, userId) {
	// save to the firestore database without picture information
	const bookCollection = db.collection('books');
	const bookRef = await bookCollection.add({
		title: book.title,
		short_description: book.short_description,
		description: book.description,
		author: book.author,
		user_id: userId,
		create_at: admin.firestore.Timestamp.now().seconds,
		likes: 0
	});

	// save the pictures
	const smallPictureUrl = await saveFileToBucket(
		book.small_picture,
		`${userId}/${bookRef.id}/small_picture`
	);

	const mainPictureUrl = await saveFileToBucket(
		book.main_picture,
		`${userId}/${bookRef.id}/main_picture`
	);

	// update the doc in firestore database with the picture urls
	await bookRef.update({
		main_picture: mainPictureUrl,
		small_picture: smallPictureUrl
	});

	// return book id
	return bookRef.id;
}

export async function editBook(id, form, userId) {
	const bookRef = await db.collection('books').doc(id);
	let mainPicture = form.main_picture || null;
	let smallPicture = form.small_picture || null;

	delete form.main_picture;
	delete form.small_picture;
	await bookRef.update(form); //이미지를 빼고 갱신하고 이미지는 아래에서 따로 갱신한다

	//if (mainPicture) { //		`이렇게 하면 이미지를 지정하지 않을 때 사이즈 0인 파일로 업데이트 한다.`;
	if (mainPicture && mainPicture.size > 0) {
		const mainPictureUrl = await saveFileToBucket(
			mainPicture,
			`${userId}/${bookRef.id}/main_picture`
		);

		let tempResult = await bookRef.update({ main_picture: mainPictureUrl });
	}

	if (smallPicture && smallPicture.size > 0) {
		const smallPictureUrl = await saveFileToBucket(
			smallPicture,
			`${userId}/${bookRef.id}/small_picture`
		);

		bookRef.update({ small_picture: smallPictureUrl });
	}
}

export async function getBooksForUser(userId) {
	const user = await getUser(userId);
	const books = await db
		.collection('books')
		.orderBy('create_at')
		.where('user_id', '==', userId)
		.get();
	return books.docs.map((d) => {
		const likedBook = user?.bookIds?.includes(d.id) || false;
		return { id: d.id, ...d.data(), likedBook };
	});
}

// 즐겨찾는 책 페이지(프로필-탭) 작성
// 파이어베이스 쿼리체인에서 논리연산 사용법을 배우게 되겠군.
// 반전, 파이어베이스에 다르게 요청하고 스크립트에서 필터 처리한다.
// 그대로 작동하는 지 보고 위 코드 따라해보고 같은지 비교해보자
// likedBook 는 유저 컬렉션의 항목이다. 따라서 위에처럼 하면 안된다.
export async function getLikedBooks(userId) {
	const user = await getUser(userId);
	const bookIds = user?.bookIds || [];
	if (bookIds.length == 0) {
		return [];
	}
	const books = await db
		.collection('books')
		.where(admin.firestore.FieldPath.documentId(), 'in', bookIds)
		.get();

	return books.docs.map((d) => {
		const likedBook = user?.bookIds?.includes(d.id) || false;
		return { id: d.id, ...d.data(), likedBook: true };
	});
}
export async function getBook(id, userId = null) {
	const bookRef = await db.collection('books').doc(id).get();
	if (bookRef.exists) {
		const user = userId ? await getUser(userId) : null;
		const likedBook = user?.bookIds?.includes(id) || false;
		return { id: bookRef.id, ...bookRef.data(), likedBook };
	}
}

export async function getBooks(userId, page = 1) {
	const user = userId ? await getUser(userId) : null;

	const bookCount = await db.collection('books').count().get();
	const totalBooks = bookCount.data().count;
	const next = totalBooks > page * +PAGE_SIZE;
	const prev = page > 1;
	const books = await db
		.collection('books')
		.limit(+PAGE_SIZE)
		.offset((page - 1) * +PAGE_SIZE)
		.orderBy('create_at', 'desc')
		.get();

	const likedBooks = books.docs.map((d) => {
		const likedBook = user?.bookIds?.includes(d.id) || false;
		return {
			...d.data(),
			id: d.id,
			likedBook
		};
	});
	return { books: likedBooks, next, prev };
}
export async function getUser(userId) {
	const user = await db.collection('users').doc(userId).get();
	return user?.data();
}
export async function toggleBookLike(bookId, userId) {
	const bookDoc = db.collection('books').doc(bookId);
	const userDoc = db.collection('users').doc(userId);
	const user = await userDoc.get();
	const userData = user.data();

	// unlike the book
	if (userData.bookIds && userData.bookIds.includes(bookId)) {
		await userDoc.update({
			bookIds: admin.firestore.FieldValue.arrayRemove(bookId)
		});
		await bookDoc.update({
			likes: admin.firestore.FieldValue.increment(-1)
		});
	}
	// like the book
	else {
		await userDoc.update({
			bookIds: admin.firestore.FieldValue.arrayUnion(bookId)
		});
		await bookDoc.update({
			likes: admin.firestore.FieldValue.increment(1)
		});
	}
	return await getBook(bookId, userId);
}
