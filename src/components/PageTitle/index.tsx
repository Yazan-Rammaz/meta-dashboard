import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Button, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { FC } from 'react';

interface PageTitleProps {
    heading?: string;
    subHeading?: string;
    docs?: string;
}

const PageTitle: FC<PageTitleProps> = ({ heading = '', subHeading = '', docs = '', ...rest }) => {
    return (
        <Grid2 container justifyContent="space-between" alignItems="center" {...rest}>
            <Grid2>
                <Typography variant="h3" component="h3" gutterBottom>
                    {heading}
                </Typography>
                <Typography variant="subtitle2">{subHeading}</Typography>
            </Grid2>
            <Grid2>
                <Button
                    href={docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                >
                    {heading} Documentation
                </Button>
            </Grid2>
        </Grid2>
    );
};

PageTitle.propTypes = {
    heading: PropTypes.string,
    subHeading: PropTypes.string,
    docs: PropTypes.string,
};

export default PageTitle;
