import { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../store/slices/categorySlice';
import { getExpenses, addExpense, deleteExpense, updateExpense } from '../../store/slices/expenseSlice';

function Expenses() {
  const dispatch = useDispatch()
  const {categories} = useSelector((state) => state.category)
  const {loading, expenses} = useSelector((state) => state.expense)

  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshExpenses, setRefreshExpenses] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const sortExpenses = (expenses) => {
    // creating a shallow copy of the array before sorting, which prevents mutation of the original array
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  };


  useEffect(() => {
    dispatch(getCategories("expense"))
    dispatch(getExpenses())
  }, [dispatch,refreshExpenses]);

  useEffect(() => {
    // Sort and set the filtered expenses only when `expenses` changes
    if (expenses.length > 0) {
      const sortedExpenses = sortExpenses(expenses);
      setFilteredExpenses(sortedExpenses);
    }
  }, [expenses, refreshExpenses]);

  console.log(expenses)
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

  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteExpense(id))
      console.log(response)
      setRefreshExpenses(prev => !prev); // Trigger refresh
      toast.success("expense deleted successfully")
    } catch (error) {
      console.log(error)
      toast.error(parseErrorMessage(error))
    }
  }


  const addExpenses = async (data) => {
    try {
      const response = await dispatch(addExpense(data))
      console.log(response)
      setRefreshExpenses(prev => !prev); // Trigger refresh
      setShowModal(false); // Close modal after successful submission
      toast.success("expense added successfully")
    } catch (error) {
      console.log(error)
      toast.error(parseErrorMessage(error))
    }
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

  const editExpense = async (data) => {
    try {
      const expense = {
        _id:currentExpense._id,
        data:data
      }
      const response = await dispatch(updateExpense(expense))
      console.log(response)
      setRefreshExpenses(prev=>!prev)
      console.log(isEditable)
      setShowModal(false); // Close modal after successful submission
      setCurrentExpense(null)
      toast.success("expense updated successfully")
    } catch (error) {
      console.log(error)
      toast.error(parseErrorMessage(error))
    }
  }

  const exportExpenses = (data) => {
    const dataToExport = data.map(({ title, description, amount, date }) => ({ title, description, amount, 
      date:new Date(date).toLocaleDateString('en-GB') }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
  }

  const handleExport = (type,year) => {
    let dataToExport = [];
    if (type === 'currentMonth') {
      dataToExport = expenses.filter(expense => new Date(expense.date).getMonth() === new Date().getMonth() && new Date(expense.date).getFullYear() === new Date().getFullYear());
    } else if (type === 'particularYear' && year) {
      dataToExport = expenses.filter(expense => new Date(expense.date).getFullYear() === parseInt(year));
      if (dataToExport.length === 0) {
        toast.error(`No expenses found for the year ${year}`);
        return;
      }
    } else {
      dataToExport = expenses;
    }
    exportExpenses(dataToExport);
    setShowExportModal(false);
  }

  if(loading || !expenses) return <div className='loadercont'><div className='loader'></div></div>;

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
            <button onClick={() => {setShowModal(true)}}><IoIosAdd size={20}/> Add Expense</button>
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
        values={isEditable ? currentExpense : {}}
        type="Expense"
        isEditMode={isEditable}
        onSubmit={isEditable?(editExpense):(addExpenses)}
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
