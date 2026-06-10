import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useLoading } from '../contexts/context';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};


export default function MultipleSelectCheckmarks({names, reviews, func } : {names:string[], reviews:any[], func: (review: any)=> void })  {
  const [courseName, setCourseName] = React.useState<string[]>(names);
  const {loading, updateLoading} = useLoading()
  React.useEffect(()=> {
    setCourseName(names)
    //console.log(reviews)
  }, [names])

  const handleChange = async (event: SelectChangeEvent<typeof courseName>) =>  {
    if (loading) 
    {
      alert('select course one at a time')
      return
    }
    updateLoading(true)
    
    const {
      target: { value },
    } = event;

    //console.log(value)
    setCourseName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    
    if (value.length == 0)
    {
      updateLoading(false)
      func({...reviews, 'positive':[], 'negative':[]})
      
      return 
    }

    var filtered = reviews.filter((review) => courseName.includes( (JSON.parse(review)) ['course_raw']))
  
    var result = await fetch(`http://${API_URL}/summary/batch`, {
      method : 'POST',
      headers:
      {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(filtered)
    }).then((res)=>{
      res.json().then((data)=>{
      
        var obj = {...JSON.parse(data), 'reviews': filtered}
        //console.log(obj)
        func(obj)
        updateLoading(false)
      })
    })
    
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Course</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={courseName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name:string) => {
            const selected = courseName.includes(name);
            const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

            return (
              <MenuItem key={name} value={name}>
                <SelectionIcon
                  fontSize="small"
                  style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                />
                <ListItemText primary={name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
