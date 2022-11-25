import React from "react";
import { Form } from "react-router-dom";

const FormPage = () => {
  return (
    <div>
      <Form method="post">
        <input name="name" placeholder="姓名" />
        <button>submit</button>
      </Form>
    </div>
  );
};

export default FormPage;
