using Amazon.Runtime;
using Amazon;
using Amazon.S3;
using CheckPoint.Core.IRepositories;
using CheckPoint.Core.Services;
using CheckPoint.Data;
using CheckPoint.Data.Repositories;
using CheckPoint.Service;
using Microsoft.EntityFrameworkCore;
using CheckPoint.Service.YourApp.Infrastructure.Services;
using CheckPoint.API.Dispatchers;

using CheckPoint.Infrastructure.Repositories;


namespace Music.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddDependencyInjectoions(this IServiceCollection services)
        {
           services.AddHttpClient();

            //services.AddScoped<IManagerService, ManagerService>();
            //services.AddScoped<IStudentService, StudentService>();
            services.AddScoped<ISubmissionService, SubmissionService>();
            services.AddScoped<IExamService, ExamService>();
            services.AddScoped<IAnswerService, AnswerService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IDashBoardService, DashBoardService>();
            services.AddScoped<IGoogleSheetService, GoogleSheetService>();
            services.AddScoped<IGoogleAuthService, GoogleAuthService>();
            services.AddScoped<IOcrService, OcrService>();
            // הוספת Amazon S3 ל-DI
            //  services.AddAWSService<IAmazonS3>();

            // הוספת שכבות ה-Repository וה-Service
            services.AddScoped<IS3Repository, S3Repository>();
           services.AddScoped<IS3Service, S3Service>();
           services.AddScoped<IEmailService, EmailService>();

            //services.AddSingleton<IAmazonS3>(sp =>
            //{
            //    var configuration = sp.GetRequiredService<IConfiguration>();
            //    var credentials = new BasicAWSCredentials(
            //        configuration["AWS:AccessKey"],
            //        configuration["AWS:SecretKey"]
            //    );
            //    var clientConfig = new AmazonS3Config
            //    {
            //        RegionEndpoint = RegionEndpoint.GetBySystemName(configuration["AWS:Region"])
            //    };
            //    return new AmazonS3Client(credentials, clientConfig);
            //});
            services.AddSingleton<IAmazonS3>(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var credentials = new BasicAWSCredentials(
                //configuration["AWS:AccessKey"],
                //configuration["AWS:SecretKey"]
                Environment.GetEnvironmentVariable("AWSAccessKey"),
                Environment.GetEnvironmentVariable("AWSSecretKey")
                );
                var clientConfig = new AmazonS3Config
                {
                    RegionEndpoint = RegionEndpoint.GetBySystemName(configuration["AWS:Region"])
                };
                return new AmazonS3Client(credentials, clientConfig);
            });

            //services.AddScoped<IManagerRepository, ManagerRepository>();
            //services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<ISubmissionRepository, SubmissionRepository>();
           services.AddScoped<IExamRepository, ExamRepository>();
           services.AddScoped<IAnswerRepository, AnswerRepository>();
           services.AddScoped<IRepositoryManager, RepositoryManager>();
           services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();


            services.AddSignalR();
            services.AddScoped<INotificationService, NotificationService>(); // מ־Infrastructure
          services.AddSignalR();
           services.AddScoped<INotificationDispatcher, SignalRNotificationDispatcher>();


            //services.AddDbContext<DataContext>(options =>
            //{
            //    var configuration = services.BuildServiceProvider().GetRequiredService<IConfiguration>();
            //    var connectionString = configuration.GetConnectionString("CheckPointDB");

            //    //לזכור לבדוק אם להוריד
            //    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            //});
        }


    }
}
