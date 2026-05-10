import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Tên sản phẩm bắt buộc"),
  price: Yup.number().positive("Giá phải > 0").required("Giá bắt buộc"),
});

export default function ProductForm({ initialValues, onSubmit, onCancel }) {
  return (
    <Formik initialValues={initialValues} validationSchema={ProductSchema} onSubmit={onSubmit} enableReinitialize>
      {({ setFieldValue, values }) => (
        <Form className="space-y-4 p-4">
          <div>
            <label>Tên sản phẩm</label>
            <Field name="name" className="border p-2 w-full" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>
          <div>
            <label>Giá</label>
            <Field name="price" type="number" className="border p-2 w-full" />
            <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
          </div>
          <div>
            <label>Ảnh (mô phỏng)</label>
            <input type="file" onChange={(e) => {
              const file = e.target.files[0];
              if (file) setFieldValue("image", URL.createObjectURL(file));
            }} />
            {values.image && <img src={values.image} alt="preview" className="mt-2 h-24 w-24 object-cover" />}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button>
            <button type="button" onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded">Hủy</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}