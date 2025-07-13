using CheckPoint.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CheckPoint.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly DataContext _context;
        public IAnswerRepository Answers { get; }
        public IExamRepository Exams { get; }
        public ISubmissionRepository Submissions { get; }
        public INotificationRepository Notifications { get; }
        //public IManagerRepository Managers { get; }
        //public IStudentRepository Students { get; }
        public IUserRepository Users { get; }

        public RepositoryManager()
        {
            
        }
        public RepositoryManager(DataContext context, IAnswerRepository answers, IExamRepository exams, ISubmissionRepository submissions, IUserRepository users)
        {
            _context = context;
            Answers = answers;
            Exams = exams;
            Submissions = submissions;
            Users = users;
        }

        public async Task SaveAsync()
        {
          await  _context.SaveChangesAsync();
        }
    }
}
