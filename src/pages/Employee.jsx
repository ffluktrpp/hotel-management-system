import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { PlusSquare } from "lucide-react";

function EmployeeManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 8;

  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const displayedEmployees = employees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const employeeSnapshot = await getDocs(collection(db, "employees"));
      setEmployees(
        employeeSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    phoneNum: "",
    salary: "",
    hireDate: "",
  });

  const addEmployee = async (newEmployee) => {
    try {
      await addDoc(collection(db, "employees"), {
        ...newEmployee,
        createdAt: serverTimestamp(),
      });
      fetchEmployees();
      setShowAddPopup(false);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // ฟังก์ชันสำหรับการลบพนักงาน
  const deleteEmployee = async (id) => {
    try {
      await deleteDoc(doc(db, "employees", id));
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // ฟังก์ชันสำหรับการแก้ไขข้อมูลพนักงาน
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [editEmployee, setEditEmployee] = useState({
    name: "",
    position: "",
    phoneNum: "",
    salary: "",
    hireDate: "",
    id: "",
  });

  const editEmployeeData = async () => {
    try {
      const employeeRef = doc(db, "employees", editEmployee.id);
      await updateDoc(employeeRef, {
        name: editEmployee.name,
        position: editEmployee.position,
        phoneNum: editEmployee.phoneNum,
        salary: editEmployee.salary,
        hireDate: editEmployee.hireDate,
      });
      fetchEmployees();
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const positions = [
    "ผู้จัดการโรงแรม",
    "พนักงานต้อนรับ",
    "พนักงานบริการห้อง",
    "พนักงานครัว",
    "พนักงานทำความสะอาด",
    "พนักงานขับรถ",
  ];

  return (
    <div className="transition-all">
      {/* Header */}
      <div className="flex justify-start items-center ml-10 mb-10 gap-10">
        <div className="font-extrabold text-3xl text-black">ระบบจัดการพนักงาน</div>
        <button
          className="flex justify-center gap-2 bg-[#FDDBBB] py-2 px-4 rounded-lg hover:bg-[#FDDBBB]/80 text-black "
          onClick={() => setShowAddPopup(true)}
        >
          <PlusSquare />
          เพิ่มพนักงาน
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
                  <th className="p-4 border-b border-slate-200 bg-slate-50">ชื่อพนักงาน</th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">ตำแหน่ง</th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">เบอร์โทรศัพท์</th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">เงินเดือน</th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">วันที่เริ่มงาน</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-slate-50 hover:cursor-pointer border-b border-slate-200 text-center"
                    onClick={() => {
                      setEditEmployee({
                        id: employee.id,
                        name: employee.name,
                        position: employee.position,
                        phoneNum: employee.phoneNum,
                        salary: employee.salary,
                        hireDate: employee.hireDate,
                      });
                      setShowEditPopup(true);
                    }}
                  >
                    <td className="p-4 py-5">{employee.name || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{employee.position || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{employee.phoneNum || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{employee.salary || "ไม่ระบุ"}</td>
                    <td className="p-4 py-5">{employee.hireDate || "ไม่ระบุ"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3">
              <div className="text-sm text-slate-500">
                Showing{" "}
                <b>
                  {displayedEmployees.length} of {employees.length}
                </b>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm"
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
                  className="px-3 py-1 text-sm"
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
            <h3 className="text-lg font-bold mb-4 text-black/80">เพิ่มพนักงานใหม่</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addEmployee(newEmployee);
              }}
              className="space-y-4"
            >
              {/* Fields */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm mb-1 text-black/80">
                  ชื่อพนักงาน
                </label>
                <input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="position" className="text-sm mb-1 text-black/80">
                  ตำแหน่ง
                </label>
                <select
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                >
                  <option value="">เลือกตำแหน่ง</option>
                  {positions.map((position, index) => (
                    <option key={index} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              {/* Other fields */}
              <div className="flex flex-col">
                <label htmlFor="phoneNum" className="text-sm mb-1 text-black/80">
                  เบอร์โทรศัพท์
                </label>
                <input
                  id="phoneNum"
                  value={newEmployee.phoneNum}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phoneNum: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="salary" className="text-sm mb-1 text-black/80">
                  เงินเดือน
                </label>
                <input
                  id="salary"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="hireDate" className="text-sm mb-1 text-black/80">
                  วันที่เริ่มงาน
                </label>
                <input
                  type="date"
                  id="hireDate"
                  value={newEmployee.hireDate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
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
                  className="px-4 py-2 bg-[#FDDBBB] rounded hover:bg-[#FDDBBB]/80 text-black"
                >
                  เพิ่มพนักงาน
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
            <h3 className="text-lg font-bold mb-4 text-black/80">แก้ไขข้อมูลพนักงาน</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editEmployeeData();
              }}
              className="space-y-4"
            >
              {/* Fields */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm mb-1 text-black/80">
                  ชื่อพนักงาน
                </label>
                <input
                  id="name"
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="position" className="text-sm mb-1 text-black/80">
                  ตำแหน่ง
                </label>
                <select
                  id="position"
                  value={editEmployee.position}
                  onChange={(e) => setEditEmployee({ ...editEmployee, position: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                >
                  <option value="">เลือกตำแหน่ง</option>
                  {positions.map((position, index) => (
                    <option key={index} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              {/* Other fields */}
              <div className="flex flex-col">
                <label htmlFor="phoneNum" className="text-sm mb-1 text-black/80">
                  เบอร์โทรศัพท์
                </label>
                <input
                  id="phoneNum"
                  value={editEmployee.phoneNum}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, phoneNum: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="salary" className="text-sm mb-1 text-black/80">
                  เงินเดือน
                </label>
                <input
                  id="salary"
                  value={editEmployee.salary}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, salary: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="hireDate" className="text-sm mb-1 text-black/80">
                  วันที่เริ่มงาน
                </label>
                <input
                  type="date"
                  id="hireDate"
                  value={editEmployee.hireDate}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, hireDate: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-200 text-black"
                >
                  ยกเลิก
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => {
                    deleteEmployee(editEmployee.id); // ลบพนักงาน
                    setShowEditPopup(false); // ปิด popup หลังจากลบ
                  }}
                  className="px-4 py-2 mr-2 bg-red-500 rounded hover:bg-red-400 text-white"
                >
                  ลบพนักงาน
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FDDBBB] rounded hover:bg-[#FDDBBB]/80 text-black"
                >
                  แก้ไขข้อมูลพนักงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeManagement;
