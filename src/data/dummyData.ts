
export interface Employee {
  id: string;
  name: string;
  profileImage: string;
  isFaceEnrolled: boolean;
  position: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  projectId: string;
  location: string;
  date: string;
  isSynced: boolean;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  employeeCount: number;
  employees: Employee[];
}

export interface Exception {
  id: string;
  employeeId: string;
  employeeName: string;
  checkInTime: string;
  projectId: string;
  date: string;
}

export interface Supervisor {
  id: string;
  name: string;
  email: string;
  projectIds: string[];
}

// Helper to generate random time
const getRandomTime = (start = 7, end = 18) => {
  const hour = Math.floor(Math.random() * (end - start + 1)) + start;
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Create dummy employees
export const dummyEmployees: Employee[] = [
  { id: "E001", name: "Ahmad Al-Farsi", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Site Engineer" },
  { id: "E002", name: "Mohammed Al-Qasim", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Construction Worker" },
  { id: "E003", name: "Fatima Zahra", profileImage: "/placeholder.svg", isFaceEnrolled: false, position: "Safety Officer" },
  { id: "E004", name: "Yusuf Abdullah", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Equipment Operator" },
  { id: "E005", name: "Omar Ibn Khattab", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Electrician" },
  { id: "E006", name: "Ali Hassan", profileImage: "/placeholder.svg", isFaceEnrolled: false, position: "Plumber" },
  { id: "E007", name: "Aisha Bint Abu Bakr", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Project Coordinator" },
  { id: "E008", name: "Khalid Ibn Walid", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Surveyor" },
  { id: "E009", name: "Zainab Mohammed", profileImage: "/placeholder.svg", isFaceEnrolled: false, position: "Administrative Assistant" },
  { id: "E010", name: "Ibrahim Al-Najjar", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Foreman" },
  { id: "E011", name: "Hassan Al-Basri", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Carpenter" },
  { id: "E012", name: "Maryam Jafari", profileImage: "/placeholder.svg", isFaceEnrolled: false, position: "Quality Inspector" },
  { id: "E013", name: "Nasser Al-Khaldi", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Painter" },
  { id: "E014", name: "Samir Mahmoud", profileImage: "/placeholder.svg", isFaceEnrolled: false, position: "Mason" },
  { id: "E015", name: "Leila Hosseini", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Architect" },
  { id: "E016", name: "Jamal Al-Dmour", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "HVAC Technician" },
  { id: "E017", name: "Tariq Aziz", profileImage: "/placeholder.svg", isFaceEnrolled: false, position: "Welder" },
  { id: "E018", name: "Samira Al-Obaidi", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Interior Designer" },
  { id: "E019", name: "Fawzi Masoud", profileImage: "/placeholder.svg", isFaceEnrolled: true, position: "Equipment Mechanic" },
  { id: "E020", name: "Layla El-Amin", profileImage: "/placeholder.svg", isFaceEnrolled: false, position: "Procurement Specialist" },
];

// Create dummy projects
export const dummyProjects: Project[] = [
  {
    id: "P001",
    name: "Al Madinah Towers",
    location: "Riyadh, Saudi Arabia",
    employeeCount: 12,
    employees: dummyEmployees.slice(0, 12)
  },
  {
    id: "P002",
    name: "Palm Gardens Resort",
    location: "Dubai, UAE",
    employeeCount: 8,
    employees: dummyEmployees.slice(12, 20)
  },
  {
    id: "P003",
    name: "Jeddah Business District",
    location: "Jeddah, Saudi Arabia",
    employeeCount: 10,
    employees: [...dummyEmployees.slice(5, 10), ...dummyEmployees.slice(15, 20)]
  }
];

// Generate current date
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

// Create dummy attendance records for today
export const generateDummyAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  
  dummyProjects.forEach(project => {
    project.employees.forEach(employee => {
      // 80% of employees have checked in
      if (Math.random() < 0.8) {
        const checkInTime = `${formattedDate}T${getRandomTime(7, 9)}:00`;
        
        // 60% of checked-in employees have also checked out
        const hasCheckedOut = Math.random() < 0.6;
        const checkOutTime = hasCheckedOut ? `${formattedDate}T${getRandomTime(16, 18)}:00` : null;
        
        records.push({
          id: `A${Math.random().toString(36).substr(2, 9)}`,
          employeeId: employee.id,
          employeeName: employee.name,
          checkInTime,
          checkOutTime,
          projectId: project.id,
          location: project.location,
          date: formattedDate,
          isSynced: Math.random() > 0.2 // 80% are synced
        });
      }
    });
  });
  
  return records;
};

// Generate exceptions (people who checked in but didn't check out)
export const generateExceptions = (attendance: AttendanceRecord[]): Exception[] => {
  return attendance
    .filter(record => record.checkInTime && !record.checkOutTime)
    .map(record => ({
      id: `E${Math.random().toString(36).substr(2, 9)}`,
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      checkInTime: record.checkInTime || '',
      projectId: record.projectId,
      date: record.date
    }));
};

// Create supervisor
export const dummySupervisor: Supervisor = {
  id: "S001",
  name: "Hamza Al-Farooq",
  email: "hamza@tanseeq-investment.com",
  projectIds: ["P001", "P002", "P003"]
};

export const dummyAttendance = generateDummyAttendance();
export const dummyExceptions = generateExceptions(dummyAttendance);
