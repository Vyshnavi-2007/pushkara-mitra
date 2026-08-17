import React, { useState } from 'react';
import {
  Radio,
  CheckCircle,
  X,
  Image as ImageIcon,
  UserRound,
  MapPin,
  Phone
} from 'lucide-react';

import { useData } from '../../shared/context/DataContext';

export const MissingPersonControl = () => {
  const {
    missingPersons,
    updateMissingStatus,
    createAnnouncement
  } = useData();

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Support both photo and photoUrl
  const getPhoto = (person) => {
    return person?.photo || person?.photoUrl || '';
  };

  // =========================================================
  // BROADCAST MISSING PERSON ALERT
  // =========================================================
  const handleVerifyAndBroadcast = (caseItem) => {
    const photo = getPhoto(caseItem);

    updateMissingStatus(
      caseItem.caseId,
      'ALERT_BROADCASTED'
    );

    // Create COMPLETE announcement
    createAnnouncement({
      id: `A-${Date.now()}`,

      type: 'MISSING_PERSON',

      title: '🚨 MISSING PERSON ALERT',

      message: `${caseItem.personName}, Age ${caseItem.age}, was reported missing. Last seen at ${caseItem.lastSeenGhatName}. Contact the nearest helpdesk if spotted.`,

      priority: 'HIGH',

      timestamp: new Date().toISOString(),

      // PHOTO
      photo: photo,
      photoUrl: photo,

      // PERSON DETAILS
      caseId: caseItem.caseId,
      personName: caseItem.personName,
      age: caseItem.age,
      gender: caseItem.gender,

      // LOCATION
      lastSeenGhatName: caseItem.lastSeenGhatName,
      lastKnownLocation: caseItem.lastKnownLocation,
      lastSeenTime: caseItem.lastSeenTime,

      // OTHER DETAILS
      clothingDescription: caseItem.clothingDescription,
      reporterName: caseItem.reporterName,
      reporterRelation: caseItem.reporterRelation,
      reporterPhone: caseItem.reporterPhone
    });

    alert(
      `Alert for ${caseItem.caseId} successfully verified and broadcasted!`
    );
  };

  // =========================================================
  // MARK REUNITED
  // =========================================================
  const handleMarkReunited = (caseItem) => {
    updateMissingStatus(
      caseItem.caseId,
      'REUNITED'
    );

    const photo = getPhoto(caseItem);

    createAnnouncement({
      id: `A-${Date.now()}`,

      type: 'MISSING_PERSON_FOUND',

      title: '✅ MISSING PERSON FOUND',

      message: `${caseItem.personName} has been successfully reunited with their family.`,

      priority: 'INFO',

      timestamp: new Date().toISOString(),

      photo: photo,
      photoUrl: photo,

      caseId: caseItem.caseId,
      personName: caseItem.personName,
      age: caseItem.age,
      gender: caseItem.gender
    });

    alert(
      `Case ${caseItem.caseId} marked as REUNITED & closed.`
    );
  };

  // =========================================================
  // OPEN PHOTO
  // =========================================================
  const openPhoto = (caseItem) => {
    const photo = getPhoto(caseItem);

    if (!photo) return;

    setSelectedPhoto(photo);
    setSelectedPerson(caseItem);
  };

  // =========================================================
  // CLOSE PHOTO
  // =========================================================
  const closePhoto = () => {
    setSelectedPhoto(null);
    setSelectedPerson(null);
  };

  return (
    <div className="space-y-8 pb-10">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        justify-between
        gap-4
        border-b
        border-blue-900/40
        pb-6
      ">

        <div>

          <h1 className="
            font-heading
            font-black
            text-2xl
            sm:text-3xl
            text-white
          ">
            Missing Person Command Center
          </h1>

          <p className="
            text-xs
            text-slate-400
            mt-1
          ">
            Verify reported missing pilgrims, broadcast
            photo-based alerts, and track reunification.
          </p>

        </div>

      </div>


      {/* =====================================================
          CASE TABLE
      ===================================================== */}

      <div className="
        glass-card
        overflow-hidden
        border-slate-800
        bg-slate-900/90
      ">

        <div className="overflow-x-auto">

          <table className="
            w-full
            text-left
            text-xs
            text-slate-300
          ">

            <thead className="
              bg-slate-950
              text-slate-400
              uppercase
              font-bold
              text-[10px]
              tracking-wider
              border-b
              border-slate-800
            ">

              <tr>

                <th className="p-4">
                  Case ID
                </th>

                <th className="p-4">
                  Photo
                </th>

                <th className="p-4">
                  Missing Person
                </th>

                <th className="p-4">
                  Last Seen Ghat & Place
                </th>

                <th className="p-4">
                  Reporter & Contact
                </th>

                <th className="p-4">
                  Sightings
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="
              divide-y
              divide-slate-800/60
            ">

              {missingPersons &&
              missingPersons.length > 0 ? (

                missingPersons.map((c) => {

                  const photo = getPhoto(c);

                  return (

                    <tr
                      key={c.caseId}
                      className="
                        hover:bg-slate-800/40
                        transition-colors
                      "
                    >

                      {/* CASE ID */}

                      <td className="
                        p-4
                        font-mono
                        font-bold
                        text-rose-400
                      ">
                        {c.caseId}
                      </td>


                      {/* PHOTO */}

                      <td className="p-4">

                        {photo ? (

                          <button
                            onClick={() => openPhoto(c)}
                            className="
                              group
                              relative
                              focus:outline-none
                            "
                          >

                            <img
                              src={photo}
                              alt={c.personName}
                              className="
                                w-16
                                h-16
                                object-cover
                                rounded-lg
                                border
                                border-slate-700
                                shadow-md
                                cursor-pointer
                                transition-all
                                duration-200
                                group-hover:scale-110
                                group-hover:border-rose-500
                              "
                            />

                            <div className="
                              absolute
                              inset-0
                              rounded-lg
                              bg-black/0
                              group-hover:bg-black/50
                              transition-all
                              flex
                              items-center
                              justify-center
                            ">

                              <ImageIcon
                                className="
                                  w-5
                                  h-5
                                  text-white
                                  opacity-0
                                  group-hover:opacity-100
                                "
                              />

                            </div>

                          </button>

                        ) : (

                          <div className="
                            w-16
                            h-16
                            rounded-lg
                            bg-slate-800
                            border
                            border-slate-700
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-[9px]
                            text-slate-500
                            gap-1
                          ">

                            <UserRound className="w-5 h-5" />

                            No Photo

                          </div>

                        )}

                      </td>


                      {/* PERSON */}

                      <td className="p-4">

                        <span className="
                          font-bold
                          text-white
                          block
                        ">
                          {c.personName}
                        </span>

                        <span className="
                          text-[10px]
                          text-slate-400
                        ">
                          {c.age} yrs, {c.gender}
                        </span>

                        {c.clothingDescription && (

                          <span className="
                            text-[10px]
                            text-slate-500
                            block
                            mt-1
                          ">
                            {c.clothingDescription}
                          </span>

                        )}

                      </td>


                      {/* LAST SEEN */}

                      <td className="p-4">

                        <span className="
                          font-bold
                          text-white
                          block
                        ">
                          {c.lastSeenGhatName}
                        </span>

                        <span className="
                          text-[10px]
                          text-slate-400
                          flex
                          items-center
                          gap-1
                        ">

                          <MapPin className="w-3 h-3" />

                          {c.lastKnownLocation}

                        </span>

                        <span className="
                          text-[10px]
                          text-slate-500
                          block
                        ">
                          {c.lastSeenTime}
                        </span>

                      </td>


                      {/* REPORTER */}

                      <td className="p-4">

                        <span className="
                          font-bold
                          text-white
                          block
                        ">
                          {c.reporterName}
                        </span>

                        <span className="
                          text-[10px]
                          text-slate-400
                          block
                        ">
                          {c.reporterRelation}
                        </span>

                        {c.reporterPhone && (

                          <span className="
                            font-mono
                            text-sky-400
                            text-[11px]
                            block
                            mt-1
                            flex
                            items-center
                            gap-1
                          ">

                            <Phone className="w-3 h-3" />

                            {c.reporterPhone}

                          </span>

                        )}

                      </td>


                      {/* SIGHTINGS */}

                      <td className="p-4">

                        <span className="
                          font-bold
                          text-amber-400
                        ">
                          {c.sightings?.length || 0}
                        </span>

                        <span className="
                          text-slate-500
                          ml-1
                        ">
                          Logged
                        </span>

                      </td>


                      {/* STATUS */}

                      <td className="p-4 font-mono">

                        <span
                          className={`
                            px-2.5
                            py-1
                            rounded
                            text-[10px]
                            font-bold

                            ${
                              c.status === 'REUNITED'
                                ? 'bg-emerald-500/20 text-emerald-300'

                                : c.status === 'ALERT_BROADCASTED'
                                ? 'bg-rose-500/20 text-rose-300 animate-pulse'

                                : 'bg-amber-500/20 text-amber-300'
                            }
                          `}
                        >
                          {c.status}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="p-4 text-center">

                        <div className="
                          flex
                          flex-col
                          sm:flex-row
                          items-center
                          justify-center
                          gap-2
                        ">

                          {c.status ===
                          'PENDING_VERIFICATION' && (

                            <button
                              onClick={() =>
                                handleVerifyAndBroadcast(c)
                              }
                              className="
                                bg-rose-600
                                hover:bg-rose-500
                                text-white
                                px-3
                                py-1.5
                                rounded-lg
                                text-xs
                                font-bold
                                shadow-md
                                inline-flex
                                items-center
                                gap-1
                              "
                            >

                              <Radio className="w-3.5 h-3.5" />

                              Broadcast Alert

                            </button>

                          )}


                          {c.status !== 'REUNITED' && (

                            <button
                              onClick={() =>
                                handleMarkReunited(c)
                              }
                              className="
                                bg-emerald-600
                                hover:bg-emerald-500
                                text-white
                                px-3
                                py-1.5
                                rounded-lg
                                text-xs
                                font-bold
                                shadow-md
                                inline-flex
                                items-center
                                gap-1
                              "
                            >

                              <CheckCircle className="w-3.5 h-3.5" />

                              Mark Reunited

                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  );

                })

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="p-10 text-center"
                  >

                    <p className="
                      font-bold
                      text-slate-400
                    ">
                      No missing-person cases found
                    </p>

                    <p className="
                      text-xs
                      text-slate-500
                      mt-1
                    ">
                      New reported cases will appear here.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          LARGE PHOTO MODAL
      ===================================================== */}

      {selectedPhoto && (

        <div
          className="
            fixed
            inset-0
            z-[999]
            bg-black/90
            backdrop-blur-md
            flex
            items-center
            justify-center
            p-4
          "
          onClick={closePhoto}
        >

          <div
            className="
              relative
              w-full
              max-w-5xl
              max-h-[95vh]
              flex
              flex-col
              items-center
              justify-center
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              onClick={closePhoto}
              className="
                absolute
                top-2
                right-2
                z-10
                w-11
                h-11
                rounded-full
                bg-rose-600
                hover:bg-rose-500
                text-white
                flex
                items-center
                justify-center
                shadow-xl
              "
            >

              <X className="w-6 h-6" />

            </button>


            {/* LARGE PHOTO */}

            <img
              src={selectedPhoto}
              alt={
                selectedPerson?.personName ||
                'Missing person'
              }
              className="
                max-w-full
                max-h-[80vh]
                object-contain
                rounded-xl
                shadow-2xl
                border
                border-slate-700
              "
            />


            {/* PERSON DETAILS */}

            {selectedPerson && (

              <div className="
                mt-4
                w-full
                max-w-xl
                bg-slate-900/95
                border
                border-slate-700
                rounded-xl
                p-4
              ">

                <div className="
                  flex
                  justify-between
                  items-start
                  gap-4
                ">

                  <div>

                    <h2 className="
                      text-white
                      font-bold
                      text-lg
                    ">
                      {selectedPerson.personName}
                    </h2>

                    <p className="
                      text-slate-400
                      text-xs
                      mt-1
                    ">
                      Case ID: {selectedPerson.caseId}
                    </p>

                  </div>

                  <span className="
                    bg-rose-500/20
                    text-rose-300
                    px-2
                    py-1
                    rounded
                    text-[10px]
                    font-bold
                  ">
                    MISSING
                  </span>

                </div>

                <div className="
                  grid
                  grid-cols-2
                  gap-3
                  mt-4
                  text-xs
                ">

                  <div>
                    <span className="text-slate-500">
                      Age / Gender
                    </span>

                    <p className="text-white">
                      {selectedPerson.age} / {selectedPerson.gender}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Last Seen
                    </span>

                    <p className="text-white">
                      {selectedPerson.lastSeenGhatName}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Location
                    </span>

                    <p className="text-white">
                      {selectedPerson.lastKnownLocation}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Time
                    </span>

                    <p className="text-white">
                      {selectedPerson.lastSeenTime}
                    </p>
                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
};

/*import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Radio, CheckCircle, Eye, PhoneCall, RefreshCw } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const MissingPersonControl = () => {
  const { missingPersons, updateMissingStatus, createAnnouncement } = useData();

  const [selectedCase, setSelectedCase] = useState(null);

  const handleVerifyAndBroadcast = (caseItem) => {
    updateMissingStatus(caseItem.caseId, 'ALERT_BROADCASTED');
    createAnnouncement({
      id: `A-${Date.now()}`,
      title: `🚨 MISSING PERSON ALERT (${caseItem.caseId}): ${caseItem.personName}, Age ${caseItem.age}. Last seen at ${caseItem.lastSeenGhatName}. Contact nearby Helpdesk!`,
      priority: 'HIGH',
      timestamp: new Date().toISOString()
    });
    alert(`Alert for ${caseItem.caseId} successfully verified & broadcasted to all on-ground staff!`);
  };

  const handleMarkReunited = (caseId) => {
    updateMissingStatus(caseId, 'REUNITED');
    alert(`Case ${caseId} marked as REUNITED & closed.`);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header *
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/40 pb-6">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Missing Person Command Center</h1>
          <p className="text-xs text-slate-400">Verify reported missing pilgrims, broadcast on-ground staff alerts, and track reunification.</p>
        </div>
      </div>

      {/* Main Cases Table *
      <div className="glass-card overflow-hidden border-slate-800 bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4">Missing Person</th>
                <th className="p-4">Last Seen Ghat & Place</th>
                <th className="p-4">Reporter & Contact</th>
                <th className="p-4">Sightings</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {missingPersons.map(c => (
                <tr key={c.caseId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-rose-400">{c.caseId}</td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{c.personName} ({c.age} yrs, {c.gender})</span>
                    <span className="text-[10px] text-slate-400">{c.clothingDescription}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{c.lastSeenGhatName}</span>
                    <span className="text-[10px] text-slate-400">{c.lastKnownLocation} ({c.lastSeenTime})</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{c.reporterName} ({c.reporterRelation})</span>
                    <span className="font-mono text-sky-400 text-[11px]">{c.reporterPhone}</span>
                  </td>
                  <td className="p-4 font-bold text-amber-400">
                    {c.sightings?.length || 0} Logged
                  </td>
                  <td className="p-4 font-mono">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      c.status === 'REUNITED' ? 'bg-emerald-500/20 text-emerald-300' :
                      c.status === 'ALERT_BROADCASTED' ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-2">
                    {c.status === 'PENDING_VERIFICATION' && (
                      <button
                        onClick={() => handleVerifyAndBroadcast(c)}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md inline-flex items-center gap-1"
                      >
                        <Radio className="w-3.5 h-3.5" /> Broadcast Alert
                      </button>
                    )}
                    {c.status !== 'REUNITED' && (
                      <button
                        onClick={() => handleMarkReunited(c.caseId)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md inline-flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Reunited
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};*/
