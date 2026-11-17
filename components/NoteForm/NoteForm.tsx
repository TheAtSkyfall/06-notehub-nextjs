"use client";

import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import type { NoteCreate } from "../../types/note";
import { createNote } from "@/lib/api";
const notesValuesScheme = Yup.object().shape({
  title: Yup.string()
    .min(3, "minimum 3 symbols")
    .max(50, "max 50 symbol")
    .required("Is required"),
  content: Yup.string().max(500, "max 500 symbols"),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Choose a valid tag",
    )
    .required("Tag is required"),
});
const initialValues: NoteCreate = {
  title: "",
  content: "",
  tag: "Todo",
};
interface NoteFormProps {
  closeForm: () => void;
}
function NoteForm({ closeForm }: NoteFormProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["notes"],
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      closeForm();
    },
  });
  const handleBookForm = (
    values: NoteCreate,
    actions: FormikHelpers<NoteCreate>,
  ) => {
    mutate(values);
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleBookForm}
      validationSchema={notesValuesScheme}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" name="tag" as="select" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={closeForm}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
export default NoteForm;
