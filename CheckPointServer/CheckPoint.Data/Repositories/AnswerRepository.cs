using CheckPoint.Core.Entities;
using CheckPoint.Core.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CheckPoint.Data.Repositories
{
    public class AnswerRepository : IAnswerRepository
    {

        private readonly DataContext _context;
        public AnswerRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Answer> GetByIdAsync(int id)
        {
            return await _context.Answers.FirstOrDefaultAsync(a => a.Id == id);
        }
        //קבלת תשובה מסוימת

        public async Task<List<Answer>> GetByExamAsync(int examId)
        {
            return await _context.Answers.Where(a => a.ExamId == examId).ToListAsync();
        }
        //קבלת כל התשובות של מבחן מסוים
        public async Task<Answer> GetByExamIdAndSection(int examId, char section)
        {
            return await _context.Answers.FirstOrDefaultAsync(a => a.ExamId == examId && a.Section == section);
        }
        //קבלת תשובה מסוימת של מבחן מסוים

        public async Task AddAsync(Answer answer)
        {
            await _context.Answers.AddAsync(answer);
        }

        public async Task deleteAnswersAsyncByExamId(int examId)
        {

            var answers = await _context.Answers.Where(a =>a.ExamId == examId).ToListAsync(); ;
            if (answers != null)
            {
                foreach(var a in answers)
                _context.Answers.Remove(a);


            }


        }
    }

}
