import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { login } from "../Features/UserSlice";
import { getExpenses, resetExpenses } from "../Features/ExpenseSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isSuccess, isError, error } = useSelector(
    (state) => state.users,
  );

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isError) {
      alert(error || "Invalid email or password");
      return;
    }

    if (isSuccess && user) {
      const loadUserExpenses = async () => {
        dispatch(resetExpenses());
        await dispatch(getExpenses());
        navigate("/home");
      };

      loadUserExpenses();
    }
  }, [dispatch, isSuccess, isError, user, error, navigate]);

  return (
    <div className="login-container">
      <Container fluid>
        <Form className="login-card" onSubmit={handleLogin}>
          <Row>
            <Col md={12}>
              <h2>Login</h2>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Button type="submit" className="login-btn">
                Login
              </Button>

              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
