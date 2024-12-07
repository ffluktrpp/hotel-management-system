import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { PlusSquare } from "lucide-react";

function Booking() {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 8;

  const totalPages = Math.ceil(bookings.length / rowsPerPage);
  const displayedBooking = bookings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const bookingSnapshot = await getDocs(collection(db, "bookings"));
      setBookings(
        bookingSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newBooking, setNewBooking] = useState({
    roomNo: "",
    type: "",
    name: "",
    phoneNum: "",
    amount: "",
    checkIn: "",
    checkOut: "",
    pricePerNight: "",
    total: "",
  });

  const roomTypes = [
    { label: "Standard", price: 1000 },
    { label: "Deluxe", price: 2000 },
    { label: "Suite", price: 3000 },
  ];

  const calculateTotal = (checkIn, checkOut, pricePerNight) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * pricePerNight : 0;
  };

  const addBooking = async (newBooking) => {
    try {
      await addDoc(collection(db, "bookings"), {
        ...newBooking,
        createdAt: serverTimestamp(),
      });
      fetchBookings();
      setShowAddPopup(false);
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!bookingId) {
      console.error("Booking ID is not defined.");
      return;
    }
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editBooking, setEditBooking] = useState(null);

  const updateBooking = async (bookingId, updatedData) => {
    if (!bookingId) {
      console.error("Booking ID is not defined.");
      return;
    }
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, updatedData);
      fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  return (
    <div className="transition-all">
      {/* Header */}
      <div className="flex justify-start items-center ml-10 mb-10 gap-10">
        <div className="font-extrabold text-3xl text-black">บันทึกการจอง</div>
        <button
          className="flex justify-center gap-2 bg-[#FDDBBB] py-2 px-4 rounded-lg hover:bg-[#FDDBBB]/80 text-black "
          onClick={() => setShowAddPopup(true)}
        >
          <PlusSquare />
          เพิ่มการจอง
        </button>
      </div>

      {/* Table */}
      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <>
            <table className="w-full table-auto min-w-max text-center">
              <thead>
                <tr>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    หมายเลขห้อง
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    ประเภทห้องพัก
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    ผู้เข้าพัก
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    จำนวนผู้เข้าพัก
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    วันที่เช็คอิน
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    วันที่เช็คเอาท์
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50 text-center">
                    ราคาห้องพักต่อคืน
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50 text-center">
                    ราคารวม
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedBooking.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-50 hover:cursor-pointer border-b border-slate-200 text-center"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <td className="p-4 py-5">{booking.roomNo || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{booking.type || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{booking.name || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{booking.amount || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{booking.checkIn || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">
                      {booking.checkOut || "ไม่ระบุ"}
                    </td>
                    <td className="p-4 py-5 text-center">
                      {booking.pricePerNight || "ไม่ระบุ"}
                    </td>
                    <td className="p-4 py-5 text-center">
                      {booking.total || "ไม่ระบุ"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3">
              <div className="text-sm text-slate-500">
                Showing{" "}
                <b>
                  {displayedBooking.length} of {bookings.length}
                </b>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm ${
                    currentPage === 1 ? "text-gray-500" : ""
                  }`}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 ${
                      currentPage === i + 1 ? "bg-[#FFF9BF] text-black" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm ${
                    currentPage === totalPages ? "text-gray-500" : ""
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Popup Add */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#FFF9BF] p-8 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-bold mb-4 text-black/80">
              เพิ่มการจองใหม่
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const total = calculateTotal(
                  newBooking.checkIn,
                  newBooking.checkOut,
                  newBooking.pricePerNight
                );
                addBooking({ ...newBooking, total });
              }}
              className="space-y-4"
            >
              {/* Fields */}
              <div className="flex flex-col">
                <label htmlFor="roomNo" className="text-sm mb-1 text-black/80">
                  หมายเลขห้อง
                </label>
                <input
                  id="roomNo"
                  value={newBooking.roomNo}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, roomNo: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="type" className="text-sm mb-1 text-black/80">
                  ประเภทห้องพัก
                </label>
                <select
                  id="type"
                  value={newBooking.type}
                  onChange={(e) => {
                    const selectedType = roomTypes.find(
                      (type) => type.label === e.target.value
                    );
                    setNewBooking({
                      ...newBooking,
                      type: selectedType.label,
                      pricePerNight: selectedType.price,
                    });
                  }}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                >
                  <option value="">เลือกประเภทห้องพัก</option>
                  {roomTypes.map((room) => (
                    <option key={room.label} value={room.label}>
                      {room.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="roomNo" className="text-sm mb-1 text-black/80">
                  ผู้เข้าพัก
                </label>
                <input
                  type="text"
                  value={newBooking.name}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="roomNo" className="text-sm mb-1 text-black/80">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  value={newBooking.phoneNum}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, phoneNum: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="roomNo" className="text-sm mb-1 text-black/80">
                  จำนวนผู้เข้าพัก
                </label>
                <input
                  type="number"
                  value={newBooking.amount}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="checkIn" className="text-sm mb-1 text-black/80">
                  วันที่เช็คอิน
                </label>
                <input
                  type="date"
                  id="checkIn"
                  value={newBooking.checkIn}
                  onChange={(e) =>
                    setNewBooking({
                      ...newBooking,
                      checkIn: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="checkOut"
                  className="text-sm mb-1 text-black/80"
                >
                  วันที่เช็คเอาท์
                </label>
                <input
                  type="date"
                  id="checkOut"
                  value={newBooking.checkOut}
                  onChange={(e) =>
                    setNewBooking({
                      ...newBooking,
                      checkOut: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddPopup(false)}
                  className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-200 text-black"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-300 hover:bg-green-500 rounded text-black"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Booking Details Popup */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-bold mb-4 text-black/80">
              ข้อมูลการจอง
            </h3>
            <p className="mb-2 text-black">
              หมายเลขห้อง: {selectedBooking.roomNo}
            </p>
            <p className="mb-2 text-black">
              ประเภทห้อง: {selectedBooking.type}
            </p>
            <p className="mb-2 text-black">
              ชื่อผู้จอง: {selectedBooking.name}
            </p>
            <p className="mb-2 text-black">
              เบอร์ผู้จอง: {selectedBooking.phoneNum}
            </p>
            <p className="mb-2 text-black">
              จำนวนผู้เข้าพัก: {selectedBooking.amount}
            </p>
            <p className="mb-2 text-black">
              วันที่เข้าพัก: {selectedBooking.checkIn}
            </p>
            <p className="mb-4 text-black">
              วันที่ออก: {selectedBooking.checkOut}
            </p>
            <p className="mb-4 text-black">
              ราคาห้องพักต่อคืน: {selectedBooking.pricePerNight}.00 ฿
            </p>
            <p className="mb-4 text-black">
              ราคารวม: {selectedBooking.total}.00 ฿
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-red-300 rounded hover:bg-red-400 text-black"
                onClick={() => deleteBooking(selectedBooking.id)}
              >
                ลบ
              </button>
              <button
                className="px-4 py-2 mr-2 bg-[#FDDBBB] rounded hover:bg-[#FDDBBB]/70 text-black"
                onClick={() => {
                  setSelectedBooking(selectedBooking);
                  setEditBooking(selectedBooking);
                  setShowEditPopup(true);
                }}
              >
                แก้ไข
              </button>
              <button
                className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-200 text-black"
                onClick={() => setSelectedBooking(null)}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Edit */}
      {showEditPopup && editBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#FFF9BF] p-8 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-bold mb-4 text-black/80">
              แก้ไขการจอง
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedTotal = calculateTotal(
                  editBooking.checkIn,
                  editBooking.checkOut,
                  editBooking.pricePerNight
                );
                updateBooking(editBooking.id, {
                  ...editBooking,
                  total: updatedTotal,
                });
                setShowEditPopup(false);
              }}
              className="space-y-4"
            >
              <div className="flex flex-col">
                <label
                  htmlFor="roomNoEdit"
                  className="text-sm mb-1 text-black/80"
                >
                  หมายเลขห้อง
                </label>
                <input
                  id="roomNoEdit"
                  value={editBooking.roomNo}
                  onChange={(e) =>
                    setEditBooking({ ...editBooking, roomNo: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="typeEdit"
                  className="text-sm mb-1 text-black/80"
                >
                  ประเภทห้องพัก
                </label>
                <select
                  id="typeEdit"
                  value={editBooking.type}
                  onChange={(e) => {
                    const selectedType = roomTypes.find(
                      (type) => type.label === e.target.value
                    );
                    setEditBooking({
                      ...editBooking,
                      type: selectedType.label,
                      pricePerNight: selectedType.price,
                    });
                  }}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                >
                  <option value="">เลือกประเภทห้องพัก</option>
                  {roomTypes.map((room) => (
                    <option key={room.label} value={room.label}>
                      {room.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-200 text-black"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-300 hover:bg-blue-500 rounded text-black"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;
