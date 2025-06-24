import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mx-6 space-y-10">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">About This Project</h1>
          </div>

          {/* Project Overview */}
          <section className="bg-white rounded-lg shadow-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon="code" className="text-blue-500" />
              Project Overview
            </h2>
            <p>
              This application was created as part of a technical assessment for <strong>Hahn Software</strong>.
            </p>
            <p>
              The goal was to develop a full-stack CRUD system using <strong>Spring Boot</strong> for the backend and{" "}
              <strong>React.js</strong> for the frontend, interacting with a PostgreSQL database. The project follows
              clean code practices and demonstrates modern development techniques.
            </p>
          </section>

          {/* Tech Stack */}
          <section className="bg-white rounded-lg shadow-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon="tools" className="text-green-600" />
              Tech Stack & Features
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Backend: Java + Spring Boot with JPA and input validation</li>
              <li>Frontend: React.js with hooks, functional components, and React Router</li>
              <li>API Integration: Axios used for data fetching</li>
              <li>Database: PostgreSQL with initial schema setup</li>
              <li>Bonus: Docker setup and clean Git versioning</li>
              <li>Error handling and responsive UI using Tailwind CSS</li>
            </ul>
          </section>

          {/* Developer Info */}
          <section className="bg-white rounded-lg shadow-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon="user" className="text-purple-600" />
              Developer Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> Zaid BAARAB</p>
                <p><strong>Email:</strong> <a className="text-blue-600 underline" href="mailto:zaidbaarab@gmail.com">zaidbaarab@gmail.com</a></p>
                <p><strong>Phone:</strong> +212 6 58 57 20 07</p>
                <p><strong>Location:</strong> Morocco</p>
                <p><strong>GitHub:</strong> <a className="text-blue-600 underline" href="https://github.com/ZAID-BAARAB" target="_blank" rel="noopener noreferrer">github.com/ZAID-BAARAB</a></p>

              </div>
{/* 
              <div>
                <p><strong>GitHub:</strong> <a className="text-blue-600 underline" href="https://github.com/ZAID-BAARAB" target="_blank" rel="noopener noreferrer">github.com/ZAID-BAARAB</a></p>
              </div> */}
            </div>
          </section>

          {/* Hahn Software Info */}
          <section className="bg-white rounded-lg shadow-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon="building" className="text-yellow-600" />
              About Hahn Software
            </h2>
            <p>
              This project is exclusively developed for internal review by <strong>Hahn Software</strong>, a software
              company operating in Germany, Austria, and Morocco.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Website:</strong> <a href="https://www.hahn-software.io" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.hahn-software.io</a></li>
              <li><strong>Email:</strong> info@hahn-software.io</li>
              <li><strong>Morocco Office:</strong> 38 avenue al atlas, Agdal, Rabat</li>
            </ul>
          </section>

        </div>
      </div>
    </motion.div>
  );
};

export default About;
