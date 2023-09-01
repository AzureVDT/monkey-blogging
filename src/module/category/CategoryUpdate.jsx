import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import { Button } from "../../components/button";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { categoryStatus } from "../../utils/constants";
import { useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";

const CategoryUpdate = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { isSubmitting },
    } = useForm({
        mode: "onChange",
        defaultValues: {},
    });
    const [params] = useSearchParams();
    const categoryId = params.get("id");
    useEffect(() => {
        async function fetchData() {
            const colRef = doc(db, "categories", categoryId);
            const docData = await getDoc(colRef);
            reset(docData.data());
        }
        fetchData();
    }, [categoryId, reset]);
    if (!categoryId) return null;
    const handleUpdateCategory = async (values) => {
        const colRef = doc(db, "categories", categoryId);
        await updateDoc(colRef, {
            name: values.name,
            slug: slugify(values.slug || values.name, { lower: true }),
            status: Number(values.status),
        });
        toast.success("Update category successfully");
        navigate("/manage/category");
    };
    const watchStatus = watch("status");
    return (
        <div>
            <DashboardHeading
                title="Update category"
                desc={`Update your category id: ${categoryId}`}
            ></DashboardHeading>
            <form
                onSubmit={handleSubmit(handleUpdateCategory)}
                autoComplete="off"
            >
                <div className="form-layout">
                    <Field>
                        <Label>Name</Label>
                        <Input
                            control={control}
                            name="name"
                            placeholder="Enter your category name"
                            required
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input
                            control={control}
                            name="slug"
                            placeholder="Enter your slug"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes className="flex flex-wrap gap-x-5">
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) ===
                                    categoryStatus.APPROVED
                                }
                                value={categoryStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) ===
                                    categoryStatus.UNAPPROVED
                                }
                                value={categoryStatus.UNAPPROVED}
                            >
                                Unapproved
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <Button
                    kind="primary"
                    className="mx-auto w-[250px]"
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Update Category
                </Button>
            </form>
        </div>
    );
};

export default CategoryUpdate;
