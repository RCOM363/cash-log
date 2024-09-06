import { useState, useEffect } from 'react';
import "./Incomes.css" 
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
import { getIncomes, addIncome, deleteIncome, updateIncome } from '../../store/slices/incomeSlice';


function Incomes() {
  const dispatch = useDispatch()
  const {categories} = useSelector((state) => state.category)
  const {loading, incomes} = useSelector((state) => state.income)

  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshIncomes, setRefreshIncomes] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const sortIncomes = (incomes) => {
    // creating a shallow copy of the array before sorting, which prevents mutation of the original array
    return [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  useEffect(() => {
    dispatch(getCategories("income"))
    dispatch(getIncomes())
  }, [dispatch,refreshIncomes]);

  useEffect(() => {
    // Sort and set the filtered expenses only when `incomes` changes
    if (incomes.length > 0) {
      const sortedIncomes = sortIncomes(incomes);
      setFilteredIncomes(sortedIncomes);
    }
  }, [incomes, refreshIncomes]);


  console.log(incomes)
  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      // If the category is already selected, remove the filter
      setSelectedCategory(null);
      setFilteredIncomes(incomes);
    } else {
      // Set the selected category and filter incomes
      setSelectedCategory(categoryId);
      setFilteredIncomes(incomes.filter(income => income.category === categoryId));
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterIncomes(e.target.value);
  };

  const filterIncomes = (searchQuery) => {
    let filtered = incomes;

    if (searchQuery) {
      filtered = filtered.filter(income =>
        income.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        income.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(income.date).toLocaleDateString().includes(searchQuery)
      );
    }

    setFilteredIncomes(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteIncome(id))
      console.log(response)
      setRefreshIncomes(prev => !prev); // Trigger refresh
      toast.success("incomes deleted successfully")
    } catch (error) {
      console.log(error)
      toast.error(parseErrorMessage(error))
    }
  }


  const addIncomes = async (data) => {
    try {
      const response = await dispatch(addIncome(data))
      console.log(response)
      setRefreshIncomes(prev => !prev); // Trigger refresh
      setShowModal(false); // Close modal after successful submission
      toast.success("income added successfully")
    } catch (error) {
      console.log(error)
      toast.error(parseErrorMessage(error))
    }
  };

  const handleEdit = (income) => {
    const category = categories.find((category)=> category._id === income.category)
    console.log(category?.name)
    setCurrentIncome({
      _id:income._id,
      title:income.title,
      description:income.description,
      amount:income.amount,
      date:income.date,
      category:category?.name
    })
    setIsEditable(true);
    setShowModal(true);
  };

  const editIncome = async (data) => {
    try {
      const income = {
        _id:currentIncome._id,
        data:data
      }
      const response = await dispatch(updateIncome(income))
      console.log(response)
      setRefreshIncomes(prev=>!prev)
      console.log(isEditable)
      setShowModal(false); // Close modal after successful submission
      setCurrentIncome(null);
      toast.success("income updated successfully")
    } catch (error) {
      console.log(error)
      toast.error(parseErrorMessage(error))
    }
  }

  const exportIncomes = (data) => {
    const dataToExport = data.map(({ title, description, amount, date }) => ({ title, description, amount, 
      date:new Date(date).toLocaleDateString('en-GB') }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, "incomes.xlsx");
  }

  const handleExport = (type,year) => {
    let dataToExport = [];
    if (type === 'currentMonth') {
      dataToExport = incomes.filter(expense => new Date(expense.date).getMonth() === new Date().getMonth() && new Date(expense.date).getFullYear() === new Date().getFullYear());
    } else if (type === 'particularYear' && year) {
      dataToExport = incomes.filter(expense => new Date(expense.date).getFullYear() === parseInt(year));
      if (dataToExport.length === 0) {
        toast.error(`No expenses found for the year ${year}`);
        return;
      }
    } else {
      dataToExport = incomes;
    }
    exportIncomes(dataToExport);
    setShowExportModal(false);
  }

  if(loading || !incomes) return <div className='loadercont'><div className='loader'></div></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h2>Incomes</h2>
      <div className='filtercont'>
        <h3>Categories</h3>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div className='filterbtn'
              style={{ cursor: 'pointer', backgroundColor: selectedCategory === category._id ? 'black' : 'white' }}
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
        <div className='incomescont'>
          <div className="cont1">
            <input
            type="text"
            placeholder="Search incomes..."
            value={searchQuery}
            onChange={handleSearch}
            />
            <button onClick={() => setShowModal(true)}><IoIosAdd size={20}/> Add Income</button>
            <button onClick={() => setShowExportModal(true)}><TiExport size={20}/>Export Incomes</button>
          </div>
          <div className="cont2">
          {filteredIncomes.length > 0 ? (
            filteredIncomes.map((income) => (
              <div className='income' key={income._id}>
                <div className="cont1">
                  <div className='title'>
                    <h3>{income.title}</h3>
                    <span>{new Date(income.date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <p style={{color:"green"}}>&#8377;{income.amount}</p>
                </div>
                <div className="cont2">
                  <p>{income.description}</p>
                </div>
                <div className="cont3">
                  <div>
                    <p>
                    {income.createdAt===income.updatedAt?("Created at: "+new Date(income.createdAt).toLocaleDateString('en-GB')):("Updated at: "+new Date(income.updatedAt).toLocaleDateString('en-GB'))}
                    </p>
                  </div>
                  <div className="btns">
                    <button className='updtbtn' onClick={()=>handleEdit(income)}><MdEdit size={20}/></button>
                    <button className='delbtn' onClick={()=>handleDelete(income._id)}><MdDeleteOutline size={25}/></button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No Incomes </div>
          )}
          </div>
        </div>
      </div>

      {/* Modal for Adding Income */}
      <AddUpdateModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setCurrentIncome(null)
        }}
        values={isEditable ? currentIncome : {}}
        type="Income"
        isEditMode={isEditable}
        onSubmit={isEditable?editIncome:addIncomes}
      />
      <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          type="incomes"
      />
    </div>
  );
}

export default Incomes;

