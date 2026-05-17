import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { registerSchema } from "../Validations/UserValidations";
import { registerUser } from "../Features/UserSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(
        registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
          income: data.income,
        }),
      ).unwrap();

      alert("Registered successfully");
      navigate("/login");
    } catch (error) {
      alert(typeof error === "string" ? error : "Registration failed");
    }
  };

  return (
    <div className="login-container">
      <Container fluid>
        <Row>
          <Col md={6}>
            <Form className="login-card" onSubmit={handleSubmit(onSubmit)}>
              <section className="form">
                <div className="form-group">
                  <label htmlFor="register-name">Name</label>
                  <input
                    id="register-name"
                    type="text"
                    placeholder="Enter your name..."
                    {...register("name")}
                    className="form-control"
                  />
                  <p className="error">{errors.name?.message}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">Email</label>
                  <input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email..."
                    {...register("email")}
                    className="form-control"
                  />
                  <p className="error">{errors.email?.message}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">Password</label>
                  <input
                    id="register-password"
                    type="password"
                    placeholder="Enter your password..."
                    {...register("password")}
                    className="form-control"
                  />
                  <p className="error">{errors.password?.message}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Confirm password..."
                    {...register("confirmPassword")}
                    className="form-control"
                  />
                  <p className="error">{errors.confirmPassword?.message}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="register-income">Monthly Income</label>
                  <input
                    id="register-income"
                    type="number"
                    placeholder="Enter monthly income..."
                    {...register("income")}
                    className="form-control"
                  />
                  <p className="error">{errors.income?.message}</p>
                </div>

                <Button color="primary" className="button">
                  Register
                </Button>
              </section>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
