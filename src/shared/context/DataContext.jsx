import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  loadInitialData,
  dataService
} from '../../services/dataService';

import { TRANSLATIONS } from '../utils/translations';


const DataContext = createContext();


export const DataProvider = ({ children }) => {

  const [ghats, setGhats] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [missingPersons, setMissingPersons] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // LANGUAGE
  // =====================================================

  const [lang, setLang] = useState(
    localStorage.getItem('godavari_seva_lang') || 'EN'
  );


  // =====================================================
  // AUTH
  // =====================================================

  const [userAuth, setUserAuth] = useState(() => {

    const saved =
      localStorage.getItem('godavari_seva_auth');

    return saved
      ? JSON.parse(saved)
      : {
          isLoggedIn: false,
          role: 'PILGRIM',
          name: 'Guest Pilgrim'
        };
  });


  // =====================================================
  // LANGUAGE
  // =====================================================

  const changeLang = (newLang) => {

    setLang(newLang);

    localStorage.setItem(
      'godavari_seva_lang',
      newLang
    );
  };


  const t = (key) => {

    return (
      TRANSLATIONS[lang]?.[key] ||
      TRANSLATIONS.EN[key] ||
      key
    );
  };


  // =====================================================
  // LOGIN
  // =====================================================

  const login = (
    role,
    name,
    username = ''
  ) => {

    const authState = {
      isLoggedIn: true,
      role,
      name,
      username
    };

    setUserAuth(authState);

    localStorage.setItem(
      'godavari_seva_auth',
      JSON.stringify(authState)
    );
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    const authState = {
      isLoggedIn: false,
      role: 'PILGRIM',
      name: 'Guest Pilgrim'
    };

    setUserAuth(authState);

    localStorage.setItem(
      'godavari_seva_auth',
      JSON.stringify(authState)
    );
  };


  // =====================================================
  // REFRESH DATA
  // =====================================================

  const refreshAll = () => {

    loadInitialData();

    setGhats(
      dataService.getGhats()
    );

    setSlots(
      dataService.getSlots()
    );

    setBookings(
      dataService.getBookings()
    );

    setMissingPersons(
      dataService.getMissingPersons()
    );

    setAnnouncements(
      dataService.getAnnouncements()
    );

    setLoading(false);
  };


  useEffect(() => {

    refreshAll();

  }, []);


  // =====================================================
  // BOOKING
  // =====================================================

  const handleBookSlot = (
    bookingPayload
  ) => {

    const created =
      dataService.createBooking(
        bookingPayload
      );

    refreshAll();

    return created;
  };


  // =====================================================
  // CANCEL BOOKING
  // =====================================================

  const handleCancelBooking = (
    bookingId
  ) => {

    const result =
      dataService.cancelBooking(
        bookingId
      );

    refreshAll();

    return result;
  };


  // =====================================================
  // REPORT MISSING PERSON
  // =====================================================

  const handleReportMissing = (
    payload
  ) => {

    const created =
      dataService.createMissingPerson(
        payload
      );

    refreshAll();

    return created;
  };


  // =====================================================
  // UPDATE MISSING STATUS
  // =====================================================

  const handleUpdateMissingStatus = (
    caseId,
    status
  ) => {

    const result =
      dataService.updateMissingPersonStatus(
        caseId,
        status
      );

    refreshAll();

    return result;
  };


  // =====================================================
  // ADD SIGHTING
  // =====================================================

  const handleAddSighting = (
    caseId,
    sighting
  ) => {

    const result =
      dataService.addSighting(
        caseId,
        sighting
      );

    refreshAll();

    return result;
  };


  // =====================================================
  // SAVE GHAT
  // =====================================================

  const handleSaveGhat = (
    ghat
  ) => {

    const result =
      dataService.saveGhat(
        ghat
      );

    refreshAll();

    return result;
  };


  // =====================================================
  // CREATE ANNOUNCEMENT
  // =====================================================

  const handleCreateAnnouncement = (
    announcement
  ) => {

    const result =
      dataService.createAnnouncement(
        announcement
      );

    refreshAll();

    return result;
  };


  return (

    <DataContext.Provider
      value={{

        ghats,

        slots,

        bookings,

        missingPersons,

        announcements,

        loading,

        lang,

        changeLang,

        t,

        userAuth,

        login,

        logout,

        refreshAll,

        bookSlot:
          handleBookSlot,

        cancelBooking:
          handleCancelBooking,

        reportMissing:
          handleReportMissing,

        updateMissingStatus:
          handleUpdateMissingStatus,

        addSighting:
          handleAddSighting,

        saveGhat:
          handleSaveGhat,

        createAnnouncement:
          handleCreateAnnouncement

      }}
    >

      {children}

    </DataContext.Provider>
  );
};


export const useData = () =>
  useContext(DataContext);
/*import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadInitialData, dataService } from '../../services/dataService';
import { TRANSLATIONS } from '../utils/translations';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [ghats, setGhats] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [missingPersons, setMissingPersons] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Multi-language state: 'EN' | 'TE' | 'HI'
  const [lang, setLang] = useState(localStorage.getItem('godavari_seva_lang') || 'EN');

  // Role-based auth state: { isLoggedIn, role: 'PILGRIM' | 'STAFF' | 'ADMIN', name: string }
  const [userAuth, setUserAuth] = useState(() => {
    const saved = localStorage.getItem('godavari_seva_auth');
    return saved ? JSON.parse(saved) : { isLoggedIn: false, role: 'PILGRIM', name: 'Guest Pilgrim' };
  });

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('godavari_seva_lang', newLang);
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.EN[key] || key;
  };

  const login = (role, name, username = '') => {
    const authState = { isLoggedIn: true, role, name, username };
    setUserAuth(authState);
    localStorage.setItem('godavari_seva_auth', JSON.stringify(authState));
  };

  const logout = () => {
    const authState = { isLoggedIn: false, role: 'PILGRIM', name: 'Guest Pilgrim' };
    setUserAuth(authState);
    localStorage.setItem('godavari_seva_auth', JSON.stringify(authState));
  };

  const refreshAll = () => {
    loadInitialData();
    setGhats(dataService.getGhats());
    setSlots(dataService.getSlots());
    setBookings(dataService.getBookings());
    setMissingPersons(dataService.getMissingPersons());
    setAnnouncements(dataService.getAnnouncements());
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleBookSlot = (bookingPayload) => {
    const created = dataService.createBooking(bookingPayload);
    refreshAll();
    return created;
  };

  const handleCancelBooking = (bookingId) => {
    const res = dataService.cancelBooking(bookingId);
    refreshAll();
    return res;
  };

  const handleReportMissing = (payload) => {
    const created = dataService.createMissingPerson(payload);
    refreshAll();
    return created;
  };

  const handleUpdateMissingStatus = (caseId, status) => {
    dataService.updateMissingPersonStatus(caseId, status);
    refreshAll();
  };

  const handleAddSighting = (caseId, sighting) => {
    dataService.addSighting(caseId, sighting);
    refreshAll();
  };

  const handleSaveGhat = (ghat) => {
    dataService.saveGhat(ghat);
    refreshAll();
  };

  const handleCreateAnnouncement = (ann) => {
    dataService.createAnnouncement(ann);
    refreshAll();
  };

  return (
    <DataContext.Provider value={{
      ghats,
      slots,
      bookings,
      missingPersons,
      announcements,
      loading,
      lang,
      changeLang,
      t,
      userAuth,
      login,
      logout,
      refreshAll,
      bookSlot: handleBookSlot,
      cancelBooking: handleCancelBooking,
      reportMissing: handleReportMissing,
      updateMissingStatus: handleUpdateMissingStatus,
      addSighting: handleAddSighting,
      saveGhat: handleSaveGhat,
      createAnnouncement: handleCreateAnnouncement
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);*/
