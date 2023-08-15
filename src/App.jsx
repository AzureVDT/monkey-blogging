import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import SignUpPage from "./pages/SignUpPage";
import "./App.scss";
const App = () => {
    return (
        <div>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/sign-up"
                        element={<SignUpPage></SignUpPage>}
                    ></Route>
                </Routes>
            </AuthProvider>
        </div>
    );
};

export default App;
