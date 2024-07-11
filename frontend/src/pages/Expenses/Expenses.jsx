import { useState, useEffect } from 'react';
import axios from 'axios';
import "./Expenses.css"
import { MdDeleteOutline } from "react-icons/md";
import * as XLSX from "xlsx";
import AddUpdateModal from '../../components/AddUpdateModal/AddUpdateModal';
import toast,{Toaster} from "react-hot-toast";
import { parseErrorMessage } from '../../components/ParseErrorMessage';

function Expenses() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshExpenses, setRefreshExpenses] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);


  useEffect(() => {
    axios.get('/api/v1/categories/get-categories/expense')
      .then((res) => {
        console.log(res.data);
        setCategories(res.data.data);
      })
      .catch((err) => console.log(err));

    axios.get("/api/v1/expenses/get-expenses")
      .then((res) => {
        console.log(res.data.data);
        setExpenses(res.data.data);
        setFilteredExpenses(res.data.data); // Initialize filtered expenses
      })
      .catch((err) => console.log(err));
  }, [refreshExpenses]);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      // If the category is already selected, remove the filter
      setSelectedCategory(null);
      setFilteredExpenses(expenses);
    } else {
      // Set the selected category and filter expenses
      setSelectedCategory(categoryId);
      setFilteredExpenses(expenses.filter(expense => expense.category === categoryId));
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterExpenses(e.target.value);
  };

  const filterExpenses = (searchQuery) => {
    let filtered = expenses;

    if (searchQuery) {
      filtered = filtered.filter(expense =>
        expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(expense.date).toLocaleDateString().includes(searchQuery)
      );
    }
    setFilteredExpenses(filtered);
  };

  const handleDelete = (id) => {
    axios.delete(`/api/v1/expenses/delete-expense/${id}`)
    .then((res)=>{
      console.log(res)
      setRefreshExpenses(prev=>!prev)
      toast.success("expense deleted successfully")
    })
    .catch((err)=> {
      console.log(err)
      toast.error(parseErrorMessage(err.response.data))
    });
  }


  const addExpense = (data) => {
    axios.post('/api/v1/expenses/add-expense', data)
      .then((res) => {
        console.log(res);
        setRefreshExpenses(prev => !prev); // Trigger refresh
        setShowModal(false); // Close modal after successful submission
        toast.success("expense added successfully");
      })
      .catch((err) => {
        console.error(err)
        toast.error(parseErrorMessage(err.response.data))
      });
  };

  const handleEdit = (expense) => {
    const category = categories.find((category)=> category._id === expense.category)
    console.log(category);
    setCurrentExpense({
      _id:expense._id,
      title:expense.title,
      description:expense.description,
      amount:expense.amount,
      date:expense.date,
      category:category?.name
    });
    setIsEditable(true);
    setShowModal(true);
  };

  const editExpense = (data) => {
    axios.patch(`/api/v1/expenses/update-expense/${currentExpense._id}`,data)
      .then((res) => {
        console.log(res);
        setRefreshExpenses(prev => !prev); // Trigger refresh
        setShowModal(false); // Close modal after successful submission
        setCurrentExpense(null);
        toast.success("expense updated successfully")
      })
      .catch((err) => {
        console.error(err)
        toast.error(parseErrorMessage(err.response.data))
      });
  }

  const exportExpense = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
  }

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"1em"}}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className='filtercont'>
        <h2>Categories</h2>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div className='filterbtn'
              style={{cursor: 'pointer', backgroundColor: selectedCategory === category._id ? 'black' : 'white'}} 
              key={category._id} 
              onClick={() => handleCategoryClick(category._id)}
            >
              <h3 style={{ cursor: 'pointer', color: selectedCategory === category._id ? 'white' : 'black' }}>
                {category.name}
              </h3>
            </div>
          ))
        ) : (
          "No categories found"
        )}
      </div>
      <div>
        <div className='expensescont'>
          <h2>Expenses</h2>
          <input
          type="text"
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={handleSearch}
          />
          <button onClick={() => setShowModal(true)}>&#43; Add Expense</button>
          <button onClick={exportExpense}>Export Expenses</button>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div className='expense' key={expense._id}>
                <div className='cont1'>
                  <h3>{expense.title}</h3>
                  <h3 style={{color:"red"}}>&#8377;{expense.amount}</h3>
                </div>
                <div className='cont2'>
                  <p>{expense.description}</p>
                </div>
                <div className='cont3'>
                  <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
                  <p>
                  {expense.createdAt===expense.updatedAt?("added at: "+new Date(expense.createdAt).toLocaleString()):("updated at: "+new Date(expense.updatedAt).toLocaleString())}
                  </p>
                </div>
                <div className="cont4">
                  <button className='updtbtn' onClick={()=>handleEdit(expense)}>Edit</button>
                  <button className='delbtn' onClick={()=>handleDelete(expense._id)}>Delete<MdDeleteOutline size={15}/></button>
                </div>
              </div>
            ))
          ) : (
            "No Expenses"
          )}
        </div>
      </div>
      {/* Modal for Adding Income */}
      <AddUpdateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        defaultValues={{ ...currentExpense, type: "Expense" }}
        isEditMode={isEditable}
        onSubmit={isEditable?editExpense:addExpense}
      />
    </div>
  );
}




export default Expenses;
