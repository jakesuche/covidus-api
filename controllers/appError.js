// class appError extends Error {
//     constructor(message, statusCode) {
//         super(message);

//         this.statusCode = statusCode;
//         this.status = `${statusCode}`.startsWith('4' )? 'fail' : 'error';
//         this.isOperation = true;

//         Error.captureStackTrace(this, this.constuctor);
//     }
// }

// module.exports  = appError
//njd