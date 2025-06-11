import { pool } from './db.js';

try {
  const insertSingle = `
    INSERT INTO public.Users
           (first_name, last_name, email,
            date_of_birth, school_status, uni_affiliation)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const firstName      = 'Muslum Abd';
  const lastName       = 'Ali';
  const email          = 'modulus2@themodulus.org';
  const dateOfBirth    = '2004-05-21';             
  const schoolStatus   = 'undergrad';           
  const uniAffiliation = 'York University';    

  const { rows: [newUser] } = await pool.query(insertSingle, [
    firstName,
    lastName,
    email,
    dateOfBirth,
    schoolStatus,
    uniAffiliation,
  ]);

  console.log('Inserted user →', newUser);
} catch (err) {
  console.error('Insert failed:', err);
} finally {
  // always close the pool so Node can exit cleanly
  await pool.end();
}
