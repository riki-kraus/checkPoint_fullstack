
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
//  import { notification } from 'antd';
import "../styles/HomePage.css"
// import { FaChartBar, FaClipboardCheck, FaTachometerAlt, FaArrowRight, FaRegLightbulb, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import imgWrites from "/images/ww.png"
import {
   FaTachometerAlt, FaChartBar, FaClipboardCheck, FaArrowRight,
  // FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCheckCircle, FaFileAlt, FaChartLine, FaUsers, FaChevronDown
} from 'react-icons/fa';
import {  useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const HomePage = () => {
  // const [, setIsLoginModalOpen] = useState(false);
  // const [api] = notification.useNotification();
  const [, setScrolled] = useState(false);
  const navigate = useNavigate()
  const [api, contextHolder] = notification.useNotification();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const heroTextVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3 } }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 8px 15px rgba(128, 224, 213, 0.4)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  // const arrowVariants = {
  //   initial: { x: 0 },
  //   animate: {
  //     x: [0, 8, 0],
  //     transition: {
  //       repeat: Infinity,
  //       repeatType: "reverse",
  //       duration: 1
  //     }
  //   }
  // };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

useEffect(() => { 
  if (localStorage.getItem('token') === null) {
    setIsLoggedIn(false);
  } else {
    setIsLoggedIn(true);
  }
}, [localStorage.getItem('token')]);

  useEffect(() => {
    const interval = setInterval(() => {
      const icons = document.querySelectorAll('.floating-icon');
      icons.forEach(icon => {
        const randomY = Math.random() * 10 - 5;
        const randomX = Math.random() * 10 - 5;
        (icon as HTMLElement).style.transform = `translate(${randomX}px, ${randomY}px)`;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {contextHolder}
      {/* <img src={myImg} id="imgBackground" alt="background"></img> */}
      {/* {contextHolder}

      <motion.div
        className={`nav-container ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className="logo-container">
          <div className="logo-glow"></div>
          <motion.div
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaRegLightbulb className="logo-icon" />
            ExamAI
          </motion.div>
        </div>

        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="main-nav"
        >
          <ul>
            <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }} onClick={() => navigate('/dashboard')}
            >
              <FaTachometerAlt className="nav-icon" />
              Dashboard
            </motion.li>

            <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }}>
              <FaChartBar className="nav-icon" />
              Statistics
            </motion.li>
            <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }}>
              <FaClipboardCheck className="nav-icon" />
              Tests
            </motion.li>
          </ul>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-buttons"
        >
          <motion.button
            className="sign-in-btn"
            onClick={showLoginModal}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Sign In
          </motion.button>
        </motion.div>
      </motion.div> */}

      <div className="hero-section">
        <motion.div
          className="floating-icon icon-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <FaClipboardCheck size={30} />
        </motion.div>

        <motion.div
          className="floating-icon icon-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <FaChartBar size={30} />
        </motion.div>

        <motion.div
          className="floating-icon icon-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <FaTachometerAlt size={30} />
        </motion.div>

        <div className="hero-content">
          <motion.h1
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
          >
            {/* For testing the tests */}
            <img src={imgWrites} id="imgWrites"></img>
            {/* Advanced Exam Management System */}
          </motion.h1>

          <motion.h2
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}>
            {/* Automate test testing site */}
            Streamline your exam process with our intelligent system. Upload, check, and analyze exams with ease.

          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
           <motion.button
    onClick={() => {
      if (!isLoggedIn) {
        api.warning({
          message: 'עליך להתחבר',
          description: 'אנא התחבר לפני שתוכל לגשת לעמוד זה',
          placement: 'topRight',
          className: 'rtl-notification',
        });
        return; // חשוב! לא להמשיך לניווט אם לא מחובר
      }

      navigate('/GetStarted');
    }}
    className="get-started-btn"
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
  >
    Get Started
  </motion.button>
          </motion.div>

          <motion.div
            className="highlight-line"
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 1, delay: 1.2 }} />
        </div>
      </div>
      <AnimatePresence>

        <div className="scroll-indicator">
          <motion.div
            initial={{ y: 0 }}
            animate={{
              y: [0, 10, 0],
              transition: {
                repeat: Infinity,
                duration: 1.5
              }
            }}
          >
            {/* <p>Scroll to explore</p>
            <FaChevronDown id="FaChevronDown"/>
             */}
            <div className="scroll-content">
              <p>Scroll to explore</p>
              <FaChevronDown id="FaChevronDown" />
            </div>
          </motion.div>
        </div>
        {/* .................................... */}
        {/* {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={handleLoginCancel}
            onSuccessLogin={(email, messageType, message) => {
              setIsLoginModalOpen(false);
              messageType === 'success' ?
                api.success({
                  message: "התחברת בהצלחה!",
                  description: 'ברוך הבא למערכת! ' + { email },
                  placement: 'topRight',
                  className: 'rtl-notification',
                })
                : api.error({
                  message: 'ההתחברות נכשלה',
                  description: message,
                  placement: 'topRight',
                  className: 'rtl-notification',
                });
            }}
          />
        )} */}
      </AnimatePresence>

      <div className="features-section" id="features">
        <div className="section-header">
          <div className="section-pill">Our Features</div>
          <h2>Powerful Features</h2>
          <p>Our system provides everything you need to manage and grade exams efficiently</p>
        </div>

        <div className="features-container">
          <motion.div
            className="feature-card"
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 153, 255, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaFileAlt />
            </div>
            <h3>Automated Exam Grading</h3>
            <p>Upload scanned exams and let the system automatically analyze, grade.</p>
            <ul className="feature-list">
              <li><FaCheckCircle className="feature-check" /> Smart scan & recognition & providing immediate scoring</li>
              {/* <li><FaCheckCircle className="feature-check" /> Instant grading and scoring</li> */}
              <li><FaCheckCircle className="feature-check" /> Grade storage in student database</li>
              <li><FaCheckCircle className="feature-check" /> Optional email notifications to students</li>
            </ul>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 153, 255, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Detailed Analytics</h3>
            <p>Get comprehensive insights into student performance with our detailed analytics.</p>
            <ul className="feature-list">
              <li><FaCheckCircle className="feature-check" /> Visual reports</li>
              <li><FaCheckCircle className="feature-check" /> Performance tracking</li>
            </ul>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 153, 255, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Student Management</h3>
            <p>Easily manage student information, classes, and exam results in one place.</p>
            <ul className="feature-list">
              <li><FaCheckCircle className="feature-check" /> Centralized database</li>
              <li><FaCheckCircle className="feature-check" /> Easy organization</li>
            </ul>
          </motion.div>


        </div>
      </div>

      <div className="about-section" id="about">
        <div className="about-content">
          <div className="section-pill">About Us</div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            About ExamAI
          </motion.h2>

          <motion.div
            className="about-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>ExamAI is an advanced exam management system designed to streamline the entire examination process, from creation to grading and analysis.</p>
            <p>Our system uses cutting-edge technology to automatically process and grade exams, providing detailed feedback to both teachers and students.</p>
            <p>With ExamAI, you can save time, reduce errors, and gain valuable insights into student performance.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button className="learn-more-btn">
              Learn More <FaArrowRight className="btn-icon" />
            </button>
          </motion.div>
        </div>

        <motion.div
          className="about-image"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="glowing-mouse">
            <div className="mouse-outline"></div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default HomePage;


