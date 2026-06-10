'use client';
import Image from "next/image"
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import OutlinedCard from "./components/card";
import { useEffect, useState } from "react";
import { randomInt } from "crypto";
import IconLabelButtons from "./components/searchbtn";
import MultipleSelectCheckmarks from "./components/select";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useLoading } from "./contexts/context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DB = process.env.NEXT_PUBLIC_DATABASE;
export default function Home() {
  const [prof, setProf] = useState("")
  const {loading, updateLoading} = useLoading()


  

  const updateProf = (newprof:string) => {setProf(newprof)}
  const [result, setResult] = useState({'reviews':[], 'positive':[], 'negative':[]})
  const updateResult = (newResult:{'reviews':[], 'positive':[], 'negative':[]})=>{
   
    setResult(newResult)

  }

  const [courses, setCourses] = useState([])
  const updateCourses = ((newCourses: any)=>{
    setCourses(newCourses)
  })

  
  

  return (
    <div className = "m-8 flex flex-col items-center w-full h-full" >
          <div className = "flex justify-center m-8">
              Review Analyzer
          </div>

          <div className = "flex flex-row justify-around w-full">
            <div className = "grid grid-cols-1 lg:gap-10 sm:grid-cols-2 gap-4 md:gap-5 ">
             
             <TextField id = "filled-basic" label = "Professor" variant = "filled" value={prof} onChange={(newWord)=> updateProf(newWord.target.value)}  />
              <div className="h-20 flex flex-col justify-center "> <IconLabelButtons func={ async()=>{
              
          
         
              try {
                 //console.log(prof)
              updateLoading(true)
              console.log(result)
              updateProf(prof.trim())
              if (prof.length  == 0) return;
              
              var [first_name, last_name = ''] = prof.split(' ')
              //var url = `${API_URL}/${DB}/${first_name}/${last_name}`
              //var local_url = `http://localhost:8000/reviews/${first_name}/${last_name}`
              var response  = await fetch(`http://${API_URL}/${DB}/${first_name}/${last_name}`).then((res) => 
                res.json().then((data)=>{
                    console.log(data)
                    updateResult(data)
                    if (data == '')
                      return

                    var tempCourses =  data['reviews'].map((review: any)=>{ 
                      var jsonObj = JSON.parse(review)
                      
                      return jsonObj['course_raw'] 
                    })
                    tempCourses = new Set(tempCourses)
                    
                    //console.log(tempCourses)
                    updateCourses(Array.from(tempCourses))
                    updateLoading(false)
                }
              ))
              }
             catch(error)
             {
              alert(error)
             }
              
             
              //console.log(response)
              
             }}></IconLabelButtons></div>
              
              

            </div>
         
             <MultipleSelectCheckmarks names = {courses } reviews= {result['reviews']} func= {updateResult} ></MultipleSelectCheckmarks>
          </div>

          { loading && <div> <HourglassBottomIcon></HourglassBottomIcon> Loading </div>}
          {
            result.reviews != undefined ? (  <div className="flex flex-row mt-20 w-1/2 min-w-120 justify-center">
             
              <div className=" flex flex-col gap-5 w-1/2">
               <div className=" flex w-60 justify-center">Positive</div>
                { 
                result['positive'].map((item)=>  <OutlinedCard key={result ['positive'].indexOf(item)} content = {item}></OutlinedCard>)
                }
              </div>

              <div className="flex flex-col gap-5 w-1/2 items-end">
                  <div className=" flex w-60 justify-center">Negative</div>
                    {result['negative'].map((item)=> <OutlinedCard key={-result['negative'].indexOf(item)} content = {item}></OutlinedCard>)}
                  </div>
              </div>) :
                        <div className="mt-10"> This profeessor wasn't found. </div>
          }
        

         
    </div>
  );
}
