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

function CustomerManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 8;

  const totalPages = Math.ceil(customers.length / rowsPerPage);
  const displayedCustomers = customers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const customerSnapshot = await getDocs(collection(db, "customers"));
      setCustomers(
        customerSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phoneNum: "",
    email: "",
    stayDate: "", // เปลี่ยนเป็นเก็บวันที่เข้าพัก
    stayDetails: "", // ข้อมูลการเข้าพัก
  });

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editCustomer, setEditCustomer] = useState({
    name: "",
    phoneNum: "",
    email: "",
    stayDate: "", // เปลี่ยนเป็นเก็บวันที่เข้าพัก
    stayDetails: "", // ข้อมูลการเข้าพัก
  });

  const addCustomer = async (newCustomer) => {
    try {
      await addDoc(collection(db, "customers"), {
        ...newCustomer,
        createdAt: serverTimestamp(),
      });
      fetchCustomers();
      setShowAddPopup(false);
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await deleteDoc(doc(db, "customers", id));
      fetchCustomers();
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const updateCustomer = async (id, updatedCustomer) => {
    try {
      const customerRef = doc(db, "customers", id);
      await updateDoc(customerRef, updatedCustomer);
      fetchCustomers();
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  return (
    <div className="transition-all">
      {/* Header */}
      <div className="flex justify-start items-center ml-10 mb-10 gap-10">
        <div className="font-extrabold text-3xl text-black">ระบบบริหารลูกค้า</div>
        <button
          className="flex justify-center gap-2 bg-[#FDDBBB] py-2 px-4 rounded-lg hover:bg-[#FDDBBB]/80 text-black"
          onClick={() => setShowAddPopup(true)}
        >
          <PlusSquare />
          เพิ่มลูกค้า
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
                  <th className="p-4 border-b border-slate-200 bg-slate-50">ชื่อ</th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">เบอร์โทรศัพท์</th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">อีเมล</th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">ข้อมูลการเข้าพัก</th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">วันที่เข้าพัก</th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {displayedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50 hover:cursor-pointer border-b border-slate-200 text-center"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="p-4 py-5">{customer.name || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{customer.phoneNum || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{customer.email || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{customer.stayDetails || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{customer.stayDate || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">
                      <button
                        className="bg-yellow-500 text-white py-1 px-3 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                          setEditCustomer(customer);
                          setShowEditPopup(true);
                        }}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomer(customer.id);
                        }}
                      >
                        ลบ
                      </button>
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
                  {displayedCustomers.length} of {customers.length}
                </b>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm ${currentPage === 1 ? "text-gray-500" : ""}`}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 ${currentPage === i + 1 ? "bg-[#FFF9BF] text-black" : ""}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm ${currentPage === totalPages ? "text-gray-500" : ""}`}
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
            <h3 className="text-lg font-bold mb-4 text-black/80">เพิ่มลูกค้าใหม่</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCustomer(newCustomer);
              }}
              className="space-y-4"
            >
              {/* Fields */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm mb-1 text-black/80">ชื่อ</label>
                <input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phoneNum" className="text-sm mb-1 text-black/80">เบอร์โทรศัพท์</label>
                <input
                  id="phoneNum"
                  value={newCustomer.phoneNum}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phoneNum: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm mb-1 text-black/80">อีเมล</label>
                <input
                  id="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="stayDate" className="text-sm mb-1 text-black/80">วันที่เข้าพัก</label>
                <input
                  type="date"
                  id="stayDate"
                  value={newCustomer.stayDate}
                  onChange={(e) => setNewCustomer({ ...newCustomer, stayDate: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="stayDetails" className="text-sm mb-1 text-black/80">ข้อมูลการเข้าพัก</label>
                <textarea
                  id="stayDetails"
                  value={newCustomer.stayDetails}
                  onChange={(e) => setNewCustomer({ ...newCustomer, stayDetails: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddPopup(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FDDBBB] text-black rounded hover:bg-[#FDDBBB]/80"
                >
                  เพิ่ม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Edit */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#FFF9BF] p-8 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-bold mb-4 text-black/80">แก้ไขข้อมูลลูกค้า</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateCustomer(selectedCustomer.id, editCustomer);
              }}
              className="space-y-4"
            >
              {/* Fields */}
              <div className="flex flex-col">
                <label htmlFor="editName" className="text-sm mb-1 text-black/80">ชื่อ</label>
                <input
                  id="editName"
                  value={editCustomer.name}
                  onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="editPhoneNum" className="text-sm mb-1 text-black/80">เบอร์โทรศัพท์</label>
                <input
                  id="editPhoneNum"
                  value={editCustomer.phoneNum}
                  onChange={(e) => setEditCustomer({ ...editCustomer, phoneNum: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="editEmail" className="text-sm mb-1 text-black/80">อีเมล</label>
                <input
                  id="editEmail"
                  value={editCustomer.email}
                  onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="editStayDate" className="text-sm mb-1 text-black/80">วันที่เข้าพัก</label>
                <input
                  type="date"
                  id="editStayDate"
                  value={editCustomer.stayDate}
                  onChange={(e) => setEditCustomer({ ...editCustomer, stayDate: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="editStayDetails" className="text-sm mb-1 text-black/80">ข้อมูลการเข้าพัก</label>
                <textarea
                  id="editStayDetails"
                  value={editCustomer.stayDetails}
                  onChange={(e) => setEditCustomer({ ...editCustomer, stayDetails: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FDDBBB] text-black rounded hover:bg-[#FDDBBB]/80"
                >
                  อัปเดต
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;
