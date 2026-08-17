import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/dbService';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [ghats, setGhats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [missingCases, setMissingCases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [adminSummary, setAdminSummary] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'admin'

  const refreshData = () => {
    setGhats(dbService.getGhats());
    setBookings(dbService.getBookings());
    setMissingCases(dbService.getMissingCases());
    setNotifications(dbService.getNotifications());
    setAdminSummary(dbService.getAdminSummary());
  };

  useEffect(() => {
    refreshData();
    // Attempt Geolocation permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        (err) => {
          console.log('Location permission denied or unavailable, fallback to default Rajamahendravaram coordinates.');
          setUserLocation({ latitude: 17.0005, longitude: 81.7800 });
        }
      );
    } else {
      setUserLocation({ latitude: 17.0005, longitude: 81.7800 });
    }
  }, []);

  // Actions
  const updateGhatConfig = (ghatId, updateData) => {
    dbService.updateGhat(ghatId, updateData);
    refreshData();
  };

  const createBooking = (bookingData) => {
    const result = dbService.createBooking(bookingData);
    refreshData();
    return result;
  };

  const reportMissingPerson = (reportData) => {
    const result = dbService.createMissingCase(reportData);
    refreshData();
    return result;
  };

  const updateMissingCaseStatus = (caseId, status) => {
    const result = dbService.updateCaseStatus(caseId, status);
    refreshData();
    return result;
  };

  const submitSighting = (caseId, sightingData) => {
    const result = dbService.addSighting(caseId, sightingData);
    refreshData();
    return result;
  };

  return (
    <AppContext.Provider
      value={{
        ghats,
        bookings,
        missingCases,
        notifications,
        adminSummary,
        userLocation,
        activeTab,
        setActiveTab,
        refreshData,
        updateGhatConfig,
        createBooking,
        reportMissingPerson,
        updateMissingCaseStatus,
        submitSighting
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
