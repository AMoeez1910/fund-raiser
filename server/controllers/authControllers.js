const {hashPassword,comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer=require('nodemailer')
const connection = require('../models/db')
const { renderToString } = require('react-dom/server');
const email_existence = require('email-existence')
const Stripe = require('stripe')
const stripe = Stripe('sk_test_51OT909JvFBCqm5cO3mOWVLKvR5cdT6eDnK05rYu0tGuuwfNa6xRHNsa0Mfny4NQPSe2Z0S57SXIqrNISCl7oDJ5M00b178UuU5')
//const EmailVerify = require('../../client/src/pages/EmailVerify')
const test = (req,res) => {
    res.json("test is working")
} 
//email verification api
const sendVerifyEmail = async (name, email, id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 25,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'needaspeed639@gmail.com',
                pass: 'qsws dzzd gokz uytu',
            },
        });
        

        const expirationTimestamp = Math.floor(new Date().getTime() / 1000)

        const mailOptions = {
            from: 'needaspeed639@gmail.com',
            to: email,
            subject: 'Email Verification',
            html: `<p>Hii ${name} Please click the link below</p> <a href="http://localhost:5173/verify/${id}/${expirationTimestamp}">Verify</a>`,
        };

        const data = await transporter.sendMail(mailOptions);
        console.log('EMAIL SENT ', email, data.response);
    } catch (error) {
        console.error('Error sending verification email:', error.message);
    }
};

const verifyMail = async (req, res) => {
    try {
        const { id, expirationTimestamp } = req.params;
        const currentTimestamp = Math.floor(new Date().getTime() / 1000);
        const expirationTime = 20; // 60 seconds
        connection.query('SELECT verified FROM user WHERE id =?', [id], (errors, resu) => {
            if (errors) {
                throw errors;
            } else if ((parseInt(currentTimestamp) - parseInt(expirationTimestamp) > parseInt(expirationTime))) {
                // Verification link has expired or user is already verified.
                if(resu[0] && resu[0].verified===0){
                connection.query('DELETE FROM user WHERE id = ?', [id], (deleteErrors, deleteResult) => {
                    if (deleteErrors) {
                        console.error('Error deleting user:', deleteErrors);
                        res.status(500).sen0d('Error deleting user');
                    } else {
                        res.status(400).send('Verification link has expired, or user is already verified, and user has been deleted.');
                    }
                })};
            } else {
                connection.query('UPDATE user SET verified = 1 WHERE id = ?', [id], (updateErrors, updateResult) => {
                    if (updateErrors) {
                        console.error('Error updating user:', updateErrors);
                        res.status(500).send({message:'Error updating user'});
                    } else {
                        res.status(200).send({ message: 'Email verified successfully' });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};




//register end point
const registerUser = async (req,res) => {
 try {
    const{name,email,password} = req.body;
    if(!name){
        return res.json({
            error:'name is required'
        })
    }
        if(!password || password.length < 6){
            return res.json({
                error:'Password is required and must be 6 characters long'
            })
    }
    const sqlQuery = 'SELECT EmailAddress FROM user WHERE EmailAddress = ? LIMIT 1;';
 connection.query(sqlQuery, [email], async (err,result) => {
    if(err) throw err;
    if(result[0]) return res.json({error:'EMAIL IS TAKEN ALREADY'})
    else{
        const hashedPassword=await hashPassword(password)
        email_existence.check(email, function(error, response){
            if(!response){
            return res.json({
                error:'Email Doesnt Exist'
            })
            }
            else{
        connection.query('INSERT INTO user SET ?;', {FullName:name, EmailAddress:email, Password:hashedPassword,verified:0},(error,re)=>{
            if(error) throw error;
            connection.query('SELECT id FROM user WHERE EmailAddress =?',[email],async(errors,resu)=>{
            if(errors) throw errors;       
            sendVerifyEmail(name,email,resu[0].id)
            })
            return res.json({succes:'User has been registered,Please Verify Email to Log in'})

        });
     } });}
});
// const [rows] = await
    // Check if there are any rows in the result
    // if (rows.length > 0) {
    //     return res.json({
    //         error: "Email is taken already",
    //     });
    // }
    // Check Email 
    //await used whenn database element call
    
    // const user = await User.create({
    //     name,email,password:hashedPassword
    // })
 } catch (error) {
    console.log(error)
 }
}
//login USer
const loginUser = async (req,res)=>{
 try {
    const {email,password} = req.body
    //checks email and password by user exists
    //const user = await User.findOne({email});
    connection.query('SELECT * FROM user WHERE EmailAddress =?',[email],async (err,result)=>{
        if (err) throw err 
        if((!result.length || !await bcrypt.compare(password,result[0].Password)) || !result[0].verified) 
        return res.json({error:'Incorrect Email or Password'})
        else {
            const fullName = result[0].FullName;
            const user_id = result[0].id
            // Split the full name based on spaces
            const fullNameArray = fullName.split(' ');

            // Extract the first name (assuming it's the first element after splitting)
            const firstName = fullNameArray[0];
                //cookie token
            const token = jwt.sign({users: { FullName: firstName, id: user_id,EmailAddress:email }},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES})
            const cookiesOptions = {
                expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES *24*60*60*1000),
                httpOnly:true
            }
            res.cookie('token', token)
            res.json({ success: 'Successfully Login' });
        }
    })
//    if (match){

//     jwt.sign({email:user.email,id:user._id,name:user.name},process.env.JWT_SECRET,{},(err,token)=>{
//         if(err) throw err;
//         res.cookie('token',token).json(user)
//     })
//    } 
//    if(!match){
//    res.json({error:'Not match'})
//    }
 } catch (error) {
 }
}
//
const logsout= (req,res) => {
    res.clearCookie('token')
    return res.json({Status:"Success"})
}
const getProfile = (req,res,next)=>{
    const token =req.cookies.token
    if (token) {
        jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
            if(err){
                return res.json({Message:"Authentication Error"})
            } else{
                req.name=user.users.FullName
                req.id=user.users.id
                req.email=user.users.EmailAddress
            }
        })
    } 
    else{
       return res.json(null)
    }
}
const PasswordReset = (req, res) => {
    const { email } = req.body
    connection.query('SELECT * FROM user WHERE EmailAddress =?', [email], async (err, result) => {
        if (err) throw err
        if (!result.length) {
            return res.json({
                error: 'Email doesnt exists!'
            })
        }
        else {
            const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, { expiresIn: 100 })
            const id = result[0].id
            emailNewPass(id,token,email)
            return res.json({success:'An email has been sent'})
    }})
}
const emailNewPass = async (id,token,email) =>{
    url = `http://localhost:5173/ForgotPassword/${id}/${token}`
            try {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 25,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: 'needaspeed639@gmail.com',
                        pass: 'qsws dzzd gokz uytu',
                    },
                });
                const mailOptions = {
                    from: 'needaspeed639@gmail.com',
                    to: email,
                    subject: 'Password Reset',
                    html: `<p>Please click the link below to RESET Password </p> <a href="${url}">Verify</a>`,
                };
                
                const data = await transporter.sendMail(mailOptions);
                console.log('EMAIL SENT ', email, data.response);
        }
            catch (error) {
                console.error('Error sending verification email:', error.message);
            }
}
const NewPassword = (req, res) => {
    const { id, token } = req.params
    const { password } = req.body
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.json({
                error: 'Session Expired'

            })
        }
        else {
            if (!password || password.length < 6) {
                return res.json({
                    error: 'Password is required and must be 6 characters long'
                })
            }
            else {
                const hashedPassword = await hashPassword(password)
                connection.query(
                    'UPDATE user SET password = ? WHERE id = ?',
                    [hashedPassword, id],
                    (updateErr, updateResult) => {
                        if (updateErr) {
                            return res.json({
                                error: 'Error updating password',
                            });
                        }
                        return res.json({
                            success: 'Password updated successfully',
                        });
                    }
                );
            }
        }
    })
}

const createCampaign = async (req, res) => {
    console.log('Received data:', req.body);
    const receivedData = req.body;
    // Process the received data as needed
    res.json({ message: 'Data received successfully' });
    connection.query('INSERT INTO fundraise SET ?;', { title: receivedData.title, description: receivedData.description,goalAmount: receivedData.goal, imgUrl: receivedData.imgUrl, type: receivedData.type, createdBy:receivedData.id},(error,re)=>{

        if(error) throw error;
        console.log(re)
    });

}


const fetchFundraise = async (req, res) => { 

    const { isActive } = req.params;
    const sqlQuery = 'SELECT * FROM fundraise WHERE active = ?;';
    connection.query(sqlQuery, [isActive=="true"? 1:0 ], (err, result) => {
        if (err) {
            console.error('Error fetching fundraise:', err);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            res.status(200).send({ message: 'Fundraise fetched successfully', data: result });
        }
    });
}
const stripeIntegration = async (req, res) => {
    const {amount,id,fid} = req.body
    const customer = await stripe.customers.create({
        metadata:{
            userID:id,
            Amount:amount,
            fundID:fid
        }
    })
    const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donation',
          },
          unit_amount: amount*100,
        },
        quantity: 1,
      },
    ],
    customer : customer.id,
    mode: 'payment',
    success_url: 'http://localhost:5173/checkout-success',
    cancel_url: 'http://localhost:5173/donate',
  });

  res.send({url:session.url});
}
const donatePage = async (req, res) => {
    const { fid } = req.params;

    // Query to fetch fundraise details
    const fundraiseQuery = `
      select * from user,fundraise where user.id=fundraise.createdBY and fundraise.fundraiseid=?;;
    `;

    // Query to count donations for the specified fundraise id
    const donationCountQuery = `
      SELECT COUNT(*) AS count
      FROM fundraise
      JOIN payment ON fundraise.fundraiseid = payment.fundraiseid
      WHERE fundraise.fundraiseid = ?;
    `;
    connection.query(fundraiseQuery, [fid], (err, result) => {
        if (err) {
            console.error('Error querying payment details:', err);
            res.status(500).send({ message: 'Internal Server Error' });
        }
        else {
            connection.query(donationCountQuery, [fid], (err1, result1) => {
                if (err1) {
                    console.error('Error querying fundraise details:', err1);
                    res.status(500).send({ message: 'Internal Server Error' });
                } else {
                    res.json({
                        message: 'Success',
                        info: result,
                        number: result1,
                    });
                }
            })
        }
    });

};
const createDrive = async (req, res) => {
    console.log('Received data:', req.body);
    const receivedData = req.body;
    // Process the received data as needed
    res.json({ message: 'Data received successfully' });
    connection.query('INSERT INTO drive SET ?;', { title: receivedData.title, description: receivedData.description, location: receivedData.location,  imgUrl: receivedData.imgUrl, endDate: receivedData.endDate,createdBy:receivedData.id, type: receivedData.type},(error,re)=>{
        if(error) throw error;
        console.log(re)
    });
}

const fetchDrive = async (req, res) => {
    const { isActive } = req.params;
    const sqlQuery = 'SELECT * FROM drive WHERE active = ?;';
    connection.query(sqlQuery, [isActive == "true" ? 1 : 0], (err, result) => {
        if (err) {
            console.error('Error fetching fundraise:', err);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            res.status(200).send({ message: 'Fundraise fetched successfully', data: result });
        }
    });
}
const filterCards = (req,res) =>{
    const {type} = req.params
    const sqlquery = 'SELECT * FROM fundraise WHERE type = ? and active=1;'
    connection.query(sqlquery,[type],(error,result)=>{
        if (error) {
            console.error('Error fetching fundraise:', err);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            res.status(200).send({ message: 'Fundraise Type fetched successfully', data: result });
        }
    })
}
const filterdriveCards = (req,res) =>{
    const {type} = req.params
    const sqlquery = 'SELECT * FROM drive WHERE type = ? and active=1;'
    connection.query(sqlquery,[type],(error,result)=>{
        if (error) {
            console.error('Error fetching fundraise:', err);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            res.status(200).send({ message: 'Fundraise Type fetched successfully', data: result });
        }
    })
}
const PaymentDetails = async (req,res) => {
    const {id} = req.params;
    const sqlQuery = `select title, fundraiseId, amount, paymentDate from payment natural join fundraise where id = ?`;
    connection.query(sqlQuery, [id], (err, result) => {
        if (err) {
            console.error('Error fetching payment details:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Success', data: result });
        }
    })
}
const drivePage = (req, res) => {
    const { did } = req.params;
    const driveQuery = `select * from user,drive where user.id=drive.createdBY and drive.driveid=?; `;

    // Query to count donations for the specified drive id
    const volunteerQuery = `
    select Count(*) as count from drive,volunteer where drive.driveId=? and drive.driveId=volunteer.driveid Group BY drive.driveId
    `;
    connection.query(driveQuery, [did], (err, result) => {
        if (err) {
            console.error('Error querying payment details:', err);
            res.status(500).send({ message: 'Internal Server Error' });
        }
        else {
            connection.query(volunteerQuery, [did], (err1, result1) => {
                if (err1) {
                    console.error('Error querying drive details:', err1);
                    res.status(500).send({ message: 'Internal Server Error' });
                } else {
                    res.json({
                        message: 'Success',
                        info: result,
                        number: result1,
                    });
                }
            })
        }
    });
}
const enrollVolunteer = (req, res) => {
    const { id, did } = req.body;
    const sqlQuery = 'INSERT INTO volunteer VALUES (?, ?);';
    connection.query(sqlQuery, [id, did], (err, result) => {
        if (err) {
            console.error('Error enrolling volunteer:', err);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            res.status(200).send({ message: 'Success' });
        }
    });
}

const getDetails = (req, res) => {
    const { id } = req.params;

    try {
        const query1Result = "SELECT title, type, amount, paymentDate FROM fundraise JOIN payment ON fundraise.fundraiseID = payment.fundraiseid JOIN user ON user.id = payment.id WHERE user.id = ?;";

        const query2Result = "SELECT title, startDate, goalAmount FROM user JOIN fundraise ON user.id = fundraise.createdby WHERE user.id = ?;";

        const query3Result = "SELECT title, startDate, location FROM user JOIN drive ON user.id = drive.createdby WHERE user.id = ?;";

        connection.query(query1Result, [id], (err, result) => {
            if (err) {
                console.error('Error querying payment details:', err);
                res.status(500).send({ message: 'Internal Server Error' });
            } else {
                connection.query(query2Result, [id], (err1, result1) => {
                    if (err1) {
                        console.error('Error querying fundraise details:', err1);
                        res.status(500).send({ message: 'Internal Server Error' });
                    } else {
                        connection.query(query3Result, [id], (err2, result2) => {
                            if (err2) {
                                console.error('Error querying drive details:', err2);
                                res.status(500).send({ message: 'Internal Server Error' });
                            } else {
                                res.json({
                                    message: 'Success',
                                    payment: result,
                                    createdFundraise: result1,
                                    createdDrive: result2
                                });
                            }
                        });
                    }
                });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = { test, registerUser, loginUser, getProfile, verifyMail, PasswordReset, NewPassword, createCampaign, stripeIntegration,logsout, fetchFundraise,filterCards,donatePage,PaymentDetails, createDrive, fetchDrive,drivePage, enrollVolunteer,filterdriveCards,getDetails}



