import { useState, useEffect } from 'react';
import axios from 'axios';
import "./Incomes.css" 
import { MdDeleteOutline } from "react-icons/md";
import {useForm} from "react-hook-form";
import * as XLSX from "xlsx";


function Incomes() {
  const [categories, setCategories] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshIncomes, setRefreshIncomes] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {register, handleSubmit, formState:{errors}} = useForm();

  useEffect(() => {
    axios.get('/api/v1/categories/get-categories/income')
      .then((res) => {
        console.log(res.data);
        setCategories(res.data.data);
      })
      .catch((err) => console.log(err));

    axios.get("/api/v1/incomes/get-incomes")
      .then((res) => {
        console.log(res.data.data);
        setIncomes(res.data.data);
        setFilteredIncomes(res.data.data); // Initialize filtered incomes
      })
      .catch((err) => console.log(err));
  }, [refreshIncomes]);

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

  const handleDelete = (id) => {
    axios.delete(`/api/v1/incomes/delete-income/${id}`)
    .then((res)=>{
      console.log(res)
      setRefreshIncomes(prev=>!prev)
    })
    .catch((err)=> console.log(err));
  }


  const addIncome = (data) => {
    axios.post('/api/v1/incomes/add-income', data)
      .then((res) => {
        console.log(res);
        setRefreshIncomes(prev => !prev); // Trigger refresh
        setShowModal(false); // Close modal after successful submission
      })
      .catch((err) => console.error(err));
  };

  const exportIncomes = () => {
    const ws = XLSX.utils.json_to_sheet(incomes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, "incomes.xlsx");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
      <div className='filtercont'>
        <h2>Categories</h2>
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
          <h2>Incomes</h2>
          <input
          type="text"
          placeholder="Search incomes..."
          value={searchQuery}
          onChange={handleSearch}
          />
          <button onClick={() => setShowModal(true)}>&#43; Add Income</button>
          <button onClick={exportIncomes}>Export Incomes</button>
          {filteredIncomes.length > 0 ? (
            filteredIncomes.map((income) => (
              <div className='income' key={income._id}>
                <div className="cont1">
                  <h3>{income.title}</h3>
                  <h3 style={{color:"green"}}>&#8377;{income.amount}</h3>
                </div>
                <div className="cont2">
                  <p>{income.description}</p>
                </div>
                <div className="cont3">
                  <p>Date: {new Date(income.date).toLocaleDateString()}</p>
                  <p>
                  {income.createdAt===income.updatedAt?("added at: "+new Date(income.createdAt).toLocaleString()):("updated at: "+new Date(income.updatedAt).toLocaleString())}
                  </p>
                </div>
                <div className="cont4">
                  <button onClick={()=>handleDelete(income._id)}>Delete<MdDeleteOutline size={15}/></button>
                </div>
              </div>
            ))
          ) : (
            "No Incomes"
          )}
        </div>
      </div>

      {/* Modal for Adding Income */}
      {showModal && (
        <div className="modal">
          <form className='modal-content' onSubmit={handleSubmit(addIncome)}>
            <div className="cont1">
              <span onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <h2>Add Income</h2>
            <div className="incont">
              <label>Title</label>
              <input type="text" name="title" required {...register("title",{
                required:"Please enter a title"
              })}/>
                {
                  errors.title && (
                    <span>{errors.title.message}</span>
                  )
                }
            </div>
            <div className="incont">
              <label>Description</label>
              <textarea name="description" {...register("description")}></textarea>
            </div>
            <div className="incont">
              <label>Amount</label>
              <input type="number" name="amount" required {...register("amount",{
                required:"Please enter the amount"
              })}/>
              {
                errors.amount && (
                  <span>{errors.amount.message}</span>
                )
              }
            </div>
            <div className="incont">
              <label>Date</label>
              <input type="date" name="date" required {...register("date",{
                required:"Please select a date"
              })}/>
              {
                errors.date && (
                  <span>{errors.date.message}</span>
                )
              }
            </div>
            <div className="incont">
              <label>Category</label>
              <input type="text" name="category" required {...register("category",{
                required:"Please assign a category"
              })}/>
              {
                errors.category && (
                  <span>{errors.category.message}</span>
                )
              }
            </div>
            <button type="submit">Add Income</button>
          </form>
          </div>
      )}
    </div>
  );
}

export default Incomes;
