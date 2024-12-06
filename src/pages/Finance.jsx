import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { PlusSquare } from "lucide-react";

function Finance() {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 8;

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const displayedTransactions = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const transactionSnapshot = await getDocs(collection(db, "transactions"));
      setTransactions(
        transactionSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "income", // 'income' or 'expense'
    amount: "",
    description: "",
    date: "",
    category: "",
  });

  const transactionCategories = [
    "ที่พัก",
    "ค่าสาธารณูปโภค",
    "เงินเดือน",
    "ค่าบำรุงรักษา",
    "อื่นๆ",
  ];

  const addTransaction = async (newTransaction) => {
    try {
      await addDoc(collection(db, "transactions"), {
        ...newTransaction,
        createdAt: serverTimestamp(),
      });
      fetchTransactions();
      setShowAddPopup(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div className="transition-all">
      {/* Header */}
      <div className="flex justify-start items-center ml-10 mb-10 gap-10">
        <div className="font-extrabold text-3xl text-black">
          ระบบบัญชีและการเงิน
        </div>
        <button
          className="flex justify-center gap-2 bg-[#FDDBBB] py-2 px-4 rounded-lg hover:bg-[#FDDBBB]/80 text-black "
          onClick={() => setShowAddPopup(true)}
        >
          <PlusSquare />
          เพิ่มรายการ
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
                    ประเภท
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    จำนวนเงิน
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    หมวดหมู่
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    คำอธิบาย
                  </th>
                  <th className="p-4 border-b border-slate-200 bg-slate-50">
                    วันที่
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-slate-50 hover:cursor-pointer border-b border-slate-200 text-center"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <td className="p-4 py-5">{transaction.type}</td>
                    <td className="p-4 py-5">{transaction.amount}</td>
                    <td className="p-4 py-5">{transaction.category}</td>
                    <td className="p-4 py-5">{transaction.description}</td>
                    <td className="p-4 py-5">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3">
              <div className="text-sm text-slate-500">
                Showing{" "}
                <b>
                  {displayedTransactions.length} of {transactions.length}
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
              เพิ่มรายการใหม่
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTransaction(newTransaction);
              }}
              className="space-y-4"
            >
              <div className="flex flex-col">
                <label htmlFor="type" className="text-sm mb-1 text-black/80">
                  ประเภท
                </label>
                <select
                  id="type"
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      type: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                >
                  <option value="income">รายรับ</option>
                  <option value="expense">รายจ่าย</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="amount" className="text-sm mb-1 text-black/80">
                  จำนวนเงิน
                </label>
                <input
                  id="amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="category"
                  className="text-sm mb-1 text-black/80"
                >
                  หมวดหมู่
                </label>
                <select
                  id="category"
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {transactionCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="description"
                  className="text-sm mb-1 text-black/80"
                >
                  คำอธิบาย
                </label>
                <textarea
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-slate-300 rounded text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="date" className="text-sm mb-1 text-black/80">
                  วันที่
                </label>
                <input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      date: e.target.value,
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
    </div>
  );
}

export default Finance;
