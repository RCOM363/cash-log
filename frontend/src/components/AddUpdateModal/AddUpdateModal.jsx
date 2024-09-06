import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import "./AddUpdateModal.css";

function AddUpdateModal({ isOpen, onClose, onSubmit, values, type, isEditMode }) {
  console.log(values);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && values) {
        reset({
          _id: values._id,
          title: values.title,
          description: values.description,
          amount: values.amount,
          date: values.date,
          category: values.category
        });
      } else {
        reset({
          _id: '',
          title: '',
          description: '',
          amount: '',
          date: '',
          category: ''
        });
      }
    }
  }, [isOpen, values, isEditMode, reset]);

  return (
    isOpen && (
      <div className="modal">
        <form className='modal-content' onSubmit={handleSubmit(onSubmit)}>
          <div className="cont1">
            <span onClick={onClose}>&times;</span>
          </div>
          <h2>{isEditMode ? 'Edit' : 'Add'} {type}</h2>
          <div className="incont">
            <label>Title</label>
            <input type="text" name="title" required {...register("title")} />
            {errors.title && (
              <span>{errors.title.message}</span>
            )}
          </div>
          <div className="incont">
            <label>Description</label>
            <textarea name="description" {...register("description")}></textarea>
            <label>Amount</label>
            <input type="number" name="amount" required {...register("amount")} />
            {errors.amount && (
              <span>{errors.amount.message}</span>
            )}
          </div>
          <div className="incont">
            <label>Date</label>
            <input type="date" name="date" required {...register("date")} />
            {errors.date && (
              <span>{errors.date.message}</span>
            )}
          </div>
          <div className="incont">
            <label>Category</label>
            <input type="text" name="category" required {...register("category")} />
            {errors.category && (
              <span>{errors.category.message}</span>
            )}
          </div>
          <button className='btn' type="submit">{isEditMode ? 'Update' : 'Add'} {type}</button>
        </form>
      </div>
    )
  );
}

export default AddUpdateModal;
