import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { amber } from '@mui/material/colors';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const card = (content: string)=>
  <React.Fragment>
    <CardContent>
          <Typography variant="body2">
       {content}
       

      </Typography>
    </CardContent>
   
  </React.Fragment>




export default function OutlinedCard( {content}:{content: string}) {
  return (
    <Box className=' h-30 w-60' sx={{ }}>
      <Card variant="outlined">{card(content) }  </Card>
    </Box>
  );
}
