import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import RecordsPage from "../pages/Records/RecordsPage";
import CredentialsPage from "../pages/Credentials/CredentialsPage";
import FavoritesPage from "../pages/Favorites/FavoritesPage";
import ProfilePage from "../pages/Profile/ProfilePage";

const AppRouter = () => {
    return (
        <BrowserRouter>

            <Routes>

                {/* =================================================
                    RUTAS PÚBLICAS
                ================================================== */}

                <Route element={<PublicRoute />}>

                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />

                </Route>


                {/* =================================================
                    RUTAS PRIVADAS
                ================================================== */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<MainLayout />}>

                        <Route
                            path="/dashboard"
                            element={<DashboardPage />}
                        />

                        <Route
                            path="/records"
                            element={<RecordsPage />}
                        />

                        <Route
                            path="/credentials"
                            element={<CredentialsPage />}
                        />

                        <Route
                            path="/favorites"
                            element={<FavoritesPage />}
                        />

                        <Route
                            path="/profile"
                            element={<ProfilePage />}
                        />

                    </Route>

                </Route>


                {/* =================================================
                    RUTA PRINCIPAL
                ================================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* =================================================
                    RUTA NO ENCONTRADA
                ================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};

export default AppRouter;