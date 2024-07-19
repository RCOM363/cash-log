import { useState, useEffect } from 'react';
import axios from 'axios';
import "./Expenses.css"
import * as XLSX from "xlsx";
import AddUpdateModal from '../../components/AddUpdateModal/AddUpdateModal';
import ExportModal from '../../components/ExportModal/ExportModal';
import toast,{Toaster} from "react-hot-toast";
import { parseErrorMessage } from '../../components/ParseErrorMessage';
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { TiExport } from "react-icons/ti";

function Expenses() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshExpenses, setRefreshExpenses] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);


  useEffect(() => {
    axios.get('/api/v1/categories/get-categories/expense')
      .then((res) => {
        console.log(res.data);
        setCategories(res.data.data);
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setError(err.message)
      });

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
        setCurrentExpense({});
        setIsEditable(prev => !prev);
        setRefreshExpenses(prev => !prev); // Trigger refresh
        console.log(isEditable)
        setShowModal(false); // Close modal after successful submission
        toast.success("expense updated successfully")
      })
      .catch((err) => {
        console.error(err)
        toast.error(parseErrorMessage(err.response.data))
      });
  }

  const exportExpenses = (data) => {
    const dataToExport = data.map(({ title, description, amount, date }) => ({ title, description, amount, 
      date:new Date(date).toLocaleDateString('en-GB') }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
  }

  const handleExport = (type) => {
    const dataToExport = type === 'currentMonth'
    ? expenses.filter(expense => new Date(expense.date).getMonth() === new Date().getMonth() && new Date(expense.date).getFullYear() === new Date().getFullYear())
    : expenses;
    exportExpenses(dataToExport);
    setShowExportModal(false);
  }

  if(loading) return <div className='loadercont'><div className='loader'></div></div>;
  if(error) return <div>Error: {error}</div>;

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"1em"}}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h2>Expenses</h2>
      <div className='filtercont'>
        <h3>Categories</h3>
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
          <div className="cont1">
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <button onClick={() => {setIsEditable(false);setCurrentExpense(null);setShowModal(true)}}><IoIosAdd size={20}/> Add Expense</button>
            <button onClick={() => setShowExportModal(true)}><TiExport size={20}/>Export Expenses</button>
          </div>
          <div className="cont2">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div className='expense' key={expense._id}>
                <div className='cont1'>
                  <div className='title'>
                    <h3>{expense.title}</h3>
                    <span>{new Date(expense.date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <p style={{color:"red"}}>&#8377;{expense.amount}</p>
                </div>
                <div className='cont2'>
                  <p>{expense.description}</p>
                </div>
                <div className='cont3'>
                  <div>
                    <p>
                    {expense.createdAt===expense.updatedAt?("Created at: "+new Date(expense.createdAt).toLocaleDateString('en-GB')):("Updated at: "+new Date(expense.updatedAt).toLocaleDateString('en-GB'))}
                    </p>
                  </div>
                  <div className='btns'>
                    <button className='updtbtn' onClick={()=>handleEdit(expense)}><MdEdit size={20}/></button>
                    <button className='delbtn' onClick={()=>handleDelete(expense._id)}><MdDeleteOutline size={20}/></button>
                  </div>
                </div>  
              </div>
            ))
            ) : (
            (<div>No Expenses</div>)
          )}
          </div>
        </div>
      </div>
      {/* Modal for Adding Income */}
      <AddUpdateModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setCurrentExpense(null);
        }}
        defaultValues={isEditable ? { ...currentExpense } : {}}
        type="Expense"
        isEditMode={isEditable}
        onSubmit={isEditable?editExpense:addExpense}
      />
      <ExportModal
          isOpen={showExportModal}
          onClose={() => {setShowExportModal(false)}}
          onExport={handleExport}
          type="expenses"
      />
    </div>
  );
}




export default Expenses;
