interface Patient {
    name: string;
    username: string;
    email: string;
    phone: number;
    gender: 'male' | 'female' | 'other';
    dob: Date;
    insurance?: string;
    height?: number;
    weight?: number;
  }
  
  export default Patient;