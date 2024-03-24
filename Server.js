const express = require ('express');
const mysql = require ('mysql');
const cors = require ('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.use(cors());

//database connection 


const con = mysql.createConnection({
      host : 'localhost',
      user : 'root',
      password : '',
      database : 'todo'
})

app.post('/createtask', (req, res) => {
  const { task } = req.body;

  // Check if task is provided
  if (!task) {
      return res.status(400).json({ message: 'Invalid registration data' });
  }

  // Convert task to lowercase
  const taskLowerCase = task.toLowerCase();
  let taskstatus =' pending'

  // Begin database transaction
  con.beginTransaction((err) => {
      if (err) {
          console.log('Transaction start failed:', err);
          return res.status(500).json({ message: 'Task Registration failed' });
      }

      // Define SQL query to insert task into the database
      const taskSql = 'INSERT INTO `task`(`task_name`, `task_status`) VALUES (?,?)';

      // Execute the SQL query
      con.query(taskSql, [taskLowerCase, taskstatus], (taskErr, taskResult) => {
          if (taskErr) {
              // Rollback the transaction if an error occurs
              con.rollback(() => {
                  console.log('Failed to register task:', taskErr);
                  return res.status(500).json({ message: 'Task Registration failed' });
              });
          }

          // Commit the transaction if no error occurs
          con.commit((commitErr) => {
              if (commitErr) {
                  // Rollback the transaction if an error occurs during commit
                  con.rollback(() => {
                      console.log('Transaction commit failed:', commitErr);
                      return res.status(500).json({ message: 'Task registration failed' });
                  });
              }

              // Send success response if everything is successful
              console.log('Task registration successful');
              return res.status(200).json({ message: 'Task registration successful' });
          });
      });
  });
});

  
  //. end create task

  //create subtask
  app.post('/createsubtask', (req, res) => {
    const { subtask,taskId } = req.body;
  
    // Check if task is provided
    if (!subtask) {
        return res.status(400).json({ message: 'Invalid registration data' });
    }
    console.log('api task id ',taskId)
  
    // Convert task to lowercase
    const taskLowerCase = subtask.toLowerCase();
    let taskstatus =taskId;
  
    // Begin database transaction
    con.beginTransaction((err) => {
        if (err) {
            console.log('Transaction start failed:', err);
            return res.status(500).json({ message: 'Task Registration failed' });
        }
  
        // Define SQL query to insert task into the database
        const taskSql = 'INSERT INTO `subtask`(`subtask`, `subtask_task_id`) VALUES (?,?)';
  
        // Execute the SQL query
        con.query(taskSql, [taskLowerCase, taskstatus], (taskErr, taskResult) => {
            if (taskErr) {
                // Rollback the transaction if an error occurs
                con.rollback(() => {
                    console.log('Failed to register subtask:', taskErr);
                    return res.status(500).json({ message: 'Task Registration failed' });
                });
            }
  
            // Commit the transaction if no error occurs
            con.commit((commitErr) => {
                if (commitErr) {
                    // Rollback the transaction if an error occurs during commit
                    con.rollback(() => {
                        console.log('Transaction commit failed:', commitErr);
                        return res.status(500).json({ message: 'Task registration failed' });
                    });
                }
  
                // Send success response if everything is successful
                console.log('Task registration successful');
                return res.status(200).json({ message: 'Task registration successful' });
            });
        });
    });
  });
  
  



  // delete task
app.delete('/deletetask/:taskId', (req, res) => {
    const taskId = req.params.taskId;
  
   
  
    // Define the DELETE SQL query
    const deleteQuery = `DELETE FROM task WHERE task_id = ?`;
    
    con.query(deleteQuery, [taskId], (error, results) => {
      if (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Failed to delete record' });
      } else {
        console.log('Record deleted successfully');
        res.status(200).json({ message: 'Task deleted successfully' });
      }
    });
  });
  // end delete task

  app.get('/viewTasks', (req, res) => {
    // Define SQL query to select all tasks from the table
    const query = 'SELECT * FROM task';

    // Execute the SQL query
    con.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ message: 'Failed to fetch tasks' });
        }

        // Send the fetched tasks as JSON response
        res.status(200).json(results);
    });
});

app.get('/viewSubTasks', (req, res) => {
    //const taskId = req.params.taskId; // Correcting parameter name
    // Define SQL query to select all subtasks for the given task ID
    const query = 'SELECT * FROM subtask WHERE subtask_task_id';

    // Execute the SQL query
    con.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching subtasks:', err);
            return res.status(500).json({ message: 'Failed to fetch subtasks' });
        }

        // Send the fetched subtasks as JSON response
        res.status(200).json(results);
    });
});


app.post('/updatetask', (req, res) => {
   const { task, taskId } = req.body

    const query = 'UPDATE `task` SET `task_name`=? WHERE `task_id`=?';

    // Execute the SQL query
    con.query(query,[task, taskId],(err, results) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ message: 'Failed to update task' });
        }

        // Send the fetched subtasks as JSON response
        res.status(200).json(results);
    });
});





  app.get('/', (req,res) =>{
    res.send('Welcome to the homepage!');
  })



app.listen (8081, (req,res) =>{
    console.log('listening from port 8081')

})
