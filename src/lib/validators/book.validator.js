import yup from 'yup';

export default async function validate(formData) {
	const schema = yup.object({
		title: yup.string().required('Book title is required').min(4).max(40), // required의 인수로 default값을 전달할 수 있다
		author: yup.string().required().min(5).max(200),
		short_description: yup.string().required().min(5).max(200),
		description: yup.string().required().min(5).max(4500),
		small_picture: yup
			.mixed()
			.required()
			.test('fileType', 'The file must be an image', (value) => {
				if (value && value.type) {
					return ['image/png', 'image/gif', 'image/jpeg', 'image/svg'].includes(value.type);
				}
				return true;
			})
			.test('fileSize', 'The file must be under 4 MB', (value) => {
				if (value && value.size) {
					return value.size < 4_000_000;
				}
				return true;
			}),
		main_picture: yup
			.mixed()
			.required()
			.test('fileType', 'The file must be an image', (value) => {
				if (value && value.type) {
					return ['image/png', 'image/gif', 'image/jpeg', 'image/svg'].includes(value.type);
				}
				return true;
			})
			.test('fileSize', 'The file must be under 4 MB', (value) => {
				if (value && value.size) {
					return value.size < 4_000_000;
				}
				return true;
			})
	});

	const data = {
		title: formData.get('title'),
		author: formData.get('author'),
		description: formData.get('description'),
		short_description: formData.get('short_description'),
		main_picture: formData.get('main_picture'),
		small_picture: formData.get('small_picture')
	};

	try {
		await schema.validate(data, { abortEarly: false });
		return { success: true, book: data };
	} catch (error) {
		const errors = error.inner.reduce((agg, e) => {
			if (!agg['error_' + e.path]) {
				agg['error_' + e.path] = e.message;
			}
			return agg;
		}, {});

		// delete data.main_picture; /*사용자가 선택한 이미지를 지우게 될텐데*/
		// delete data.small_picture;

		return { ...errors, success: false };
	}
}
