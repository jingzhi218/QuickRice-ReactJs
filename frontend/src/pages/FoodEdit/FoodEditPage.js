import { useParams } from 'react-router-dom';
import classes from './foodEdit.module.css';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Title from '../../components/Title/Title';
import InputContainer from '../../components/InputContainer/InputContainer';
import { add, getById, update } from '../../services/foodService';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function FoodEditPage() {
    const { foodId } = useParams();
    const [imageUrl, setImageUrl] = useState();
    const isEditMode = !!foodId;
    const navigate = useNavigate();
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (!isEditMode) return;

        getById(foodId).then(food => {
            if (!food) return;
            reset(food);
            setImageUrl(food.imageUrl);
        });
    }, [foodId]);

    const submit = async (foodData) => {
        const food = { ...foodData, imageUrl };

        if (food.uploadTime) {
            const uploadTime = new Date(food.uploadTime);
            const delay = uploadTime - new Date();

            if (delay > 0) {
                setTimeout(async () => {
                    if (isEditMode) {
                        await update(food);
                        toast.success(`Food "${food.name}" updated successfully`);
                    } else {
                        await add(food);
                        toast.success(`Food "${food.name}" added successfully!`);
                    }
                }, delay);

                toast.info(`Food "${food.name}" will be ${isEditMode ? 'updated' : 'added'} at ${uploadTime.toLocaleString()}`);
                return;
            }
        }

        if (isEditMode) {
            await update(food);
            toast.success(`Food "${food.name}" updated successfully`);
        } else {
            const newFood = await add(food);
            toast.success(`Food "${food.name}" added successfully!`);
            navigate('/admin/editFood/' + newFood.id, { replace: true });
        }
    };

    const upload = async (event) => {
        setImageUrl(null);
        const imageUrl = await uploadImage(event);
        setImageUrl(imageUrl);
    };

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <Title title={isEditMode ? 'Edit Food' : 'Add Food'} />
                <form className={classes.form} onSubmit={handleSubmit(submit)} noValidate>
                    <InputContainer label="Select Image">
                        <input type="file" onChange={upload} accept="image/jpeg" />
                    </InputContainer>

                    {imageUrl && (
                        <a href={imageUrl} className={classes.image_link} target="_blank" rel="noopener noreferrer">
                            <img src={imageUrl} alt="Uploaded" />
                        </a>
                    )}

                    <Input
                        type="text"
                        label="Name"
                        {...register('name', { required: true, minLength: 5 })}
                        error={errors.name}
                    />

                    <Input
                        type="number"
                        label="Price"
                        {...register('price', { required: true })}
                        error={errors.price}
                    />

                    <Input
                        type="text"
                        label="Tags"
                        {...register('tags')}
                        error={errors.tags}
                    />

                    <Input
                        type="text"
                        label="Origins"
                        {...register('origins', { required: true })}
                        error={errors.origins}
                    />

                    <Input
                        type="text"
                        label="Wait Time"
                        {...register('waitTime', { required: true })}
                        error={errors.cookTime}
                    />

                    <Input
                        type="datetime-local"
                        label="Upload Time"
                        {...register('uploadTime')}
                        error={errors.uploadTime}
                    />

                    <Button type="submit" text={isEditMode ? 'Update' : 'Create'} />
                </form>
            </div>
        </div>
    );
}
