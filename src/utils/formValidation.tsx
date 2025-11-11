import { toast } from 'react-toastify';
import { employeeSchema } from '@/utils/validation_schemas/employee';
import { Employee } from '@/models/employees';

interface ValidationProps {
  validationSchema: typeof employeeSchema;
  data: Employee;
  callback: (data: Employee) => void;
  errcallback?: (error: any) => void; // Keeping any for now, will refine if specific error type is clear
}

export default async function validate({
  validationSchema,
  data,
  callback,
  errcallback
}: ValidationProps) {
  await validationSchema
    .validate(data, {
      abortEarly: false
    })
    .then(() => {
      callback(data);
    })
    .catch((error: any) => {
      toast.error('please fill all the required data!');
      if (errcallback) {
        errcallback(error);
      }
    });
}
