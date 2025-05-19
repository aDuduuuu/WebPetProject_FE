// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Account from "./pages/Account.jsx";
import AuthRoutes from "./routes/authRoute.jsx";
import FilterSection from "./pages/BreedList.jsx";
import DogBreedDetail from "./pages/DogBreedDetail.jsx";
import FindBestDog from "./pages/FindBestDog.jsx";
import Question1 from "./pages/Question1";
import Question2 from "./pages/Question2";
import Question3 from "./pages/Question3";
import Question4 from "./pages/Question4";
import Question5 from "./pages/Question5";
import Question6 from "./pages/Question6";
import Question7 from "./pages/Question7";
import { AnswerProvider } from "./context/AnswerContext"; // Import AnswerProvider
import SpaRoutes from './routes/spaRoute.jsx'; // Import SpaRoutes
import TrainerRoutes from './routes/trainerRoute.jsx';
import PostRoutes from './routes/postRoute.jsx';
import DogsellerRoutes from './routes/dogsellerRoute.jsx';
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import OrderDetail from "./pages/OrderDetail/OrderDetail.jsx";
import OrderList from "./pages/OrderList/OrderList.jsx";
import ProductRoutes from "./routes/productRoute.jsx";
import Upload from "./pages/Upload/upload.jsx";
import FavorRoutes from "./routes/favoriteRoute.jsx";
import NameRoutes from "./routes/nameRoute.jsx";
import NamePage from "./pages/Naming.jsx";
import CompareBreeds from "./pages/CompareBreeds.jsx";
import OrderReview from "./pages/OrderReview/OrderReview.jsx";
import StatisticsRoutes from "./routes/statisticsRoute.jsx";
import TotalOrders from "./pages/TotalOrders.jsx";
import Dashboard from './pages/admin/Dashboard';
import DogBreedPage from "./pages/admin/DogBreedPage";
import AddBreedPage from "./pages/admin/AddBreedPage";
import UpdateBreedPage from "./pages/admin/UpdateBreedPage"; 
import AdminSpaPage from "./pages/admin/AdminSpaPage";
import AdminTrainerPage from "./pages/admin/AdminTrainerPage.jsx";
import AdminDogSellerPage from "./pages/admin/AdminDogSellerPage";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminPostPage from "./pages/admin/AdminPostPage";
import AdminNamePage from "./pages/admin/AdminNamePage";
import AdminTotalOrders from "./pages/admin/AdminTotalOrders";
import AdminStatistics from "./pages/admin/AdminStatistics";

const App = () => (
  <AnswerProvider>
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<AuthRoutes />} />
          <Route path="/account" element={<Account />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/orderList" element={<OrderList />} />
          <Route path="/orderDetail/:id" element={<OrderDetail />} />
          <Route path="/orderReview/:id" element={<OrderReview />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/breedList" element={<FilterSection />} />
          <Route path="/dogbreeds/:breedId" element={<DogBreedDetail />} />
          <Route path="/find-best-dog" element={<FindBestDog />} />
          <Route path="/dog-name-finder" element={<NamePage />} />
          <Route path="/bestDog" element={<FindBestDog />} />
          <Route path="/question1" element={<Question1 />} />
          <Route path="/question2" element={<Question2 />} />
          <Route path="/question3" element={<Question3 />} />
          <Route path="/question4" element={<Question4 />} />
          <Route path="/question5" element={<Question5 />} />
          <Route path="/question6" element={<Question6 />} />
          <Route path="/question7" element={<Question7 />} />
          <Route path="/spas/*" element={<SpaRoutes />} />
          <Route path="/trainers/*" element={<TrainerRoutes />} />
          <Route path="/posts/*" element={<PostRoutes />} />
          <Route path="/dogsellers/*" element={<DogsellerRoutes />} />
          <Route path="/products/*" element={<ProductRoutes />} />
          <Route path="/favorites/*" element={<FavorRoutes />} />
          <Route path="/name/*" element={<NameRoutes />} />
          <Route path="/compareDogs" element={<CompareBreeds />} />
          <Route path="/statistics" element={<StatisticsRoutes />} />
          <Route path="/manageorder" element={<TotalOrders />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/dog-breeds" element={<DogBreedPage />} />
          <Route path="/dashboard/dog-breeds/add" element={<AddBreedPage />} />
          <Route path="/dashboard/dog-breeds/update/:breedId" element={<UpdateBreedPage />} />
          <Route path="/dashboard/spas" element={<AdminSpaPage />} /> 
          <Route path="/dashboard/trainers" element={<AdminTrainerPage />} />
          <Route path="/dashboard/dogsellers" element={<AdminDogSellerPage />} />
          <Route path="/dashboard/products" element={<AdminProductPage />} />
          <Route path="/dashboard/posts" element={<AdminPostPage />} />
          <Route path="/dashboard/dognames" element={<AdminNamePage />} />
          <Route path="/dashboard/orders" element={<AdminTotalOrders />} />
          <Route path="/dashboard/statistics" element={<AdminStatistics />} />
        </Routes>
      </Router>
    </AppProvider>
  </AnswerProvider>
);

export default App;
