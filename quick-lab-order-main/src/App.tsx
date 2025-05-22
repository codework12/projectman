
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { TestOrderProvider } from "./context/TestOrderContext";
import Index from "./pages/index";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyTests from "./pages/MyTests";
import AccountSettings from "./pages/AccountSettings";
import Header from "./components/elab/Header";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/auth/AdminRoute";
import Admin from "./pages/admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TestOrderProvider>
        <CartProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/my-tests" element={<MyTests />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TestOrderProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
