export const INITIAL_BOOKINGS = [
  {
    bookingId: "PUSH-2027-89A102",
    ghatId: "pushkar-ghat",
    ghatName: "Pushkar Ghat",
    slotId: "pushkar-ghat-2027-07-15-0600",
    date: "2027-07-15",
    startTime: "06:00",
    endTime: "06:30",
    ticketType: "VIP",
    ticketPricePerHead: 250,
    totalAmount: 1000,
    totalPilgrimsCount: 4,
    primaryBooker: {
      name: "Ramesh Varma",
      phone: "+91 98480 12345",
      email: "ramesh.varma@example.com",
      city: "Hyderabad",
      aadhaarNumber: "9845 1234 5678"
    },
    familyMembers: [
      { name: "Ramesh Varma", age: 48, gender: "Male", aadhaarNumber: "9845 1234 5678", relation: "Self" },
      { name: "Sunitha Varma", age: 44, gender: "Female", aadhaarNumber: "8734 5612 9012", relation: "Spouse" },
      { name: "Ananya Varma", age: 19, gender: "Female", aadhaarNumber: "5612 3478 9012", relation: "Daughter" },
      { name: "Kalyan Varma", age: 16, gender: "Male", aadhaarNumber: "3412 7890 5612", relation: "Son" }
    ],
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2027-07-10T10:15:00Z"
  },
  {
    bookingId: "PUSH-2027-44B901",
    ghatId: "saraswati-ghat",
    ghatName: "Saraswati Ghat",
    slotId: "saraswati-ghat-2027-07-15-0730",
    date: "2027-07-15",
    startTime: "07:30",
    endTime: "08:00",
    ticketType: "GENERAL",
    ticketPricePerHead: 20,
    totalAmount: 60,
    totalPilgrimsCount: 3,
    primaryBooker: {
      name: "Srinivas Rao",
      phone: "+91 94401 88990",
      email: "srinivas.rao@example.com",
      city: "Vijayawada",
      aadhaarNumber: "4512 8901 2345"
    },
    familyMembers: [
      { name: "Srinivas Rao", age: 62, gender: "Male", aadhaarNumber: "4512 8901 2345", relation: "Self" },
      { name: "Lakshmi Devi", age: 58, gender: "Female", aadhaarNumber: "6712 3489 0123", relation: "Spouse" },
      { name: "Venkat Rao", age: 32, gender: "Male", aadhaarNumber: "1234 5678 9012", relation: "Son" }
    ],
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2027-07-12T14:30:00Z"
  }
];
