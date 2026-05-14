import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Doctors from "@/pages/Doctors";
import Packages from "@/pages/Packages";
import Testimonials from "@/pages/Testimonials";
import Book from "@/pages/Book";
import AdminLogin from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import Appointments from "@/pages/admin/Appointments";
import AdminDoctors from "@/pages/admin/AdminDoctors";
import AdminServices from "@/pages/admin/AdminServices";
import AdminPackages from "@/pages/admin/AdminPackages";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const PUBLIC_PATHS = ["/", "/services", "/doctors", "/packages", "/testimonials", "/book"];
const ADMIN_PATHS = ["/admin/dashboard", "/admin/appointments", "/admin/doctors", "/admin/services", "/admin/packages", "/admin/testimonials"];

function isAdminPath(path: string) {
  return path.startsWith("/admin/") && path !== "/admin/login";
}

function AppLayout({ children, showLayout }: { children: React.ReactNode; showLayout: boolean }) {
  if (!showLayout) return <>{children}</>;
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={() => <AppLayout showLayout={true}><Home /></AppLayout>} />
      <Route path="/services" component={() => <AppLayout showLayout={true}><Services /></AppLayout>} />
      <Route path="/doctors" component={() => <AppLayout showLayout={true}><Doctors /></AppLayout>} />
      <Route path="/packages" component={() => <AppLayout showLayout={true}><Packages /></AppLayout>} />
      <Route path="/testimonials" component={() => <AppLayout showLayout={true}><Testimonials /></AppLayout>} />
      <Route path="/book" component={() => <AppLayout showLayout={true}><Book /></AppLayout>} />

      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/appointments" component={Appointments} />
      <Route path="/admin/doctors" component={AdminDoctors} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/packages" component={AdminPackages} />
      <Route path="/admin/testimonials" component={AdminTestimonials} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
