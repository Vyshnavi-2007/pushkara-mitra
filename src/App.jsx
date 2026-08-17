import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './shared/context/DataContext';
import { Navbar } from './shared/components/Navbar';
import { Footer } from './shared/components/Footer';

// User Portal Pages
import { Home } from './user/pages/Home';
import { GhatDiscovery } from './user/pages/GhatDiscovery';
import { GhatDetail } from './user/pages/GhatDetail';
import { RecommendationWizard } from './user/pages/RecommendationWizard';
import { BookingPage } from './user/pages/BookingPage';
import { TicketView } from './user/pages/TicketView';
import { MyBookingsPage } from './user/pages/MyBookingsPage';
import { SafetyCenter } from './user/pages/SafetyCenter';
import { PujaBookingPage } from './user/pages/PujaBookingPage';
import { FoodNearMePage } from './user/pages/FoodNearMePage';
import { QRVerificationPortal } from './user/pages/QRVerificationPortal';

// Dedicated Logins
import { PilgrimLoginPage } from './user/pages/PilgrimLoginPage';
import { StaffLoginPage } from './user/pages/StaffLoginPage';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';

// Admin Portal Pages
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { GhatManager } from './admin/pages/GhatManager';
import { CustomerLedger } from './admin/pages/CustomerLedger';
import { MissingPersonControl } from './admin/pages/MissingPersonControl';
import { MongoGuideView } from './admin/pages/MongoGuideView';

// Warm Godavari river-dusk background: saffron glow (top), river-teal glow (bottom)
const appBackground = {
  background: `
    radial-gradient(1100px 600px at 50% -10%, rgba(244,166,59,0.13), transparent 60%),
    radial-gradient(900px 520px at 85% 115%, rgba(47,166,160,0.10), transparent 60%),
    linear-gradient(180deg, #0A1822 0%, #0d2130 100%)
  `,
  backgroundAttachment: 'fixed'
};

export const App = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <div
          className="min-h-screen flex flex-col text-slate-100 selection:bg-[#f59e0b] selection:text-[#2a1400]"
          style={appBackground}
        >
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Pilgrim / User Portal Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PilgrimLoginPage />} />
              <Route path="/ghats" element={<GhatDiscovery />} />
              <Route path="/ghats/:id" element={<GhatDetail />} />
              <Route path="/recommendation" element={<RecommendationWizard />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/ticket/:id" element={<TicketView />} />
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/safety" element={<SafetyCenter />} />
              <Route path="/pujas" element={<PujaBookingPage />} />
              <Route path="/food" element={<FoodNearMePage />} />

              {/* Dedicated On-Ground Staff QR Checkpoint Portal */}
              <Route path="/staff/login" element={<StaffLoginPage />} />
              <Route path="/staff/scanner" element={<QRVerificationPortal />} />
              <Route path="/verify" element={<Navigate to="/staff/scanner" replace />} />

              {/* Dedicated Admin Control Center Portal */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/ghats" element={<GhatManager />} />
              <Route path="/admin/customers" element={<CustomerLedger />} />
              <Route path="/admin/missing" element={<MissingPersonControl />} />
              <Route path="/admin/mongo-guide" element={<MongoGuideView />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
/*import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './shared/context/DataContext';
import { Navbar } from './shared/components/Navbar';
import { Footer } from './shared/components/Footer';

// User Portal Pages
import { Home } from './user/pages/Home';
import { GhatDiscovery } from './user/pages/GhatDiscovery';
import { GhatDetail } from './user/pages/GhatDetail';
import { RecommendationWizard } from './user/pages/RecommendationWizard';
import { BookingPage } from './user/pages/BookingPage';
import { TicketView } from './user/pages/TicketView';
import { MyBookingsPage } from './user/pages/MyBookingsPage';
import { SafetyCenter } from './user/pages/SafetyCenter';
import { PujaBookingPage } from './user/pages/PujaBookingPage';
import { FoodNearMePage } from './user/pages/FoodNearMePage';
import { QRVerificationPortal } from './user/pages/QRVerificationPortal';

// Dedicated Logins
import { PilgrimLoginPage } from './user/pages/PilgrimLoginPage';
import { StaffLoginPage } from './user/pages/StaffLoginPage';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';

// Admin Portal Pages
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { GhatManager } from './admin/pages/GhatManager';
import { CustomerLedger } from './admin/pages/CustomerLedger';
import { MissingPersonControl } from './admin/pages/MissingPersonControl';
import { MongoGuideView } from './admin/pages/MongoGuideView';

export const App = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#06121E] text-slate-100 selection:bg-sky-500 selection:text-white">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Pilgrim / User Portal Routes *
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PilgrimLoginPage />} />
              <Route path="/ghats" element={<GhatDiscovery />} />
              <Route path="/ghats/:id" element={<GhatDetail />} />
              <Route path="/recommendation" element={<RecommendationWizard />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/ticket/:id" element={<TicketView />} />
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/safety" element={<SafetyCenter />} />
              <Route path="/pujas" element={<PujaBookingPage />} />
              <Route path="/food" element={<FoodNearMePage />} />

              {/* Dedicated On-Ground Staff QR Checkpoint Portal *
              <Route path="/staff/login" element={<StaffLoginPage />} />
              <Route path="/staff/scanner" element={<QRVerificationPortal />} />
              <Route path="/verify" element={<Navigate to="/staff/scanner" replace />} />

              {/* Dedicated Admin Control Center Portal *
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/ghats" element={<GhatManager />} />
              <Route path="/admin/customers" element={<CustomerLedger />} />
              <Route path="/admin/missing" element={<MissingPersonControl />} />
              <Route path="/admin/mongo-guide" element={<MongoGuideView />} />

              {/* Catch-all redirect *
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;*/
