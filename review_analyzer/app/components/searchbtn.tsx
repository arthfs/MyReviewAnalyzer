import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';

export default function IconLabelButtons({func=()=>{}}) {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick= {func} startIcon={ <SearchIcon />}>
        Search
      </Button>
      
    </Stack>
  );
}
