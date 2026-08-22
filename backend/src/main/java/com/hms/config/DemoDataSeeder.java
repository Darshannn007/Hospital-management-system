package com.hms.config;

import com.hms.entity.*;
import com.hms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DemoDataSeeder implements CommandLineRunner {

    @Value("${hms.seed-demo-data:false}")
    private boolean seedDemoData;

    @Autowired private UserRepository userRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private DoctorAvailRepository doctorAvailRepository;
    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private PharmacyRepository pharmacyRepository;
    @Autowired private InvoiceRepository invoiceRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!seedDemoData) {
            System.out.println("DemoDataSeeder: Skipping.");
            return;
        }

        System.out.println("=== DemoDataSeeder: CLEARING OLD DATA ===");
        invoiceRepository.deleteAllInBatch();
        appointmentRepository.deleteAllInBatch();
        doctorAvailRepository.deleteAllInBatch();
        pharmacyRepository.deleteAllInBatch();
        patientRepository.deleteAllInBatch();
        doctorRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
        System.out.println("=== OLD DATA CLEARED ===");

        System.out.println("=== DemoDataSeeder: STARTING DATA SEEDING ===");
        String defaultPassword = passwordEncoder.encode("1234");
        Random random = new Random();

        // ---- 1. Admin User ----
        UserEntity adminUser = new UserEntity();
        adminUser.setEmail("admin@gmail.com");
        adminUser.setPassword(defaultPassword);
        adminUser.setRole(Role.ADMIN);
        userRepository.save(adminUser);
        System.out.println("✓ Admin user created");

        // ---- 2. Doctors (10) ----
        String[] doctorNames = {"Dr. Rajesh Sharma", "Dr. Priya Patel", "Dr. Amit Gupta",
                "Dr. Sunita Reddy", "Dr. Vikram Singh", "Dr. Meera Iyer",
                "Dr. Suresh Kapoor", "Dr. Anjali Verma", "Dr. Nikhil Desai", "Dr. Kavita Joshi"};
        String[] specializations = {"Cardiologist", "Neurologist", "Pediatrician",
                "Orthopedic", "Dermatologist", "Psychiatrist",
                "Oncologist", "General Physician", "ENT Specialist", "Gynecologist"};

        List<UserEntity> doctorUsers = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            UserEntity u = new UserEntity();
            u.setEmail("doctor" + (i + 1) + "@gmail.com");
            u.setPassword(defaultPassword);
            u.setRole(Role.DOCTOR);
            doctorUsers.add(u);
        }
        userRepository.saveAll(doctorUsers);

        List<DoctorEntity> doctorEntities = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            DoctorEntity d = new DoctorEntity();
            d.setName(doctorNames[i]);
            d.setSpecialization(specializations[i]);
            d.setPhone("9876543" + String.format("%03d", i));
            d.setEducation("MBBS, MD");
            d.setExperience((5 + random.nextInt(15)) + " Years");
            doctorEntities.add(d);
        }
        List<DoctorEntity> savedDoctors = doctorRepository.saveAll(doctorEntities);
        System.out.println("✓ 10 Doctors created");

        // ---- 3. Patients (25) ----
        String[] firstNames = {"Aarav", "Vihaan", "Aditya", "Sai", "Arjun",
                "Rohan", "Krish", "Rahul", "Amit", "Vikram",
                "Sneha", "Priya", "Neha", "Pooja", "Anjali",
                "Kavya", "Riya", "Shruti", "Swati", "Nidhi",
                "Raj", "Karan", "Sanjay", "Rakesh", "Sunil"};
        String[] lastNames = {"Kumar", "Singh", "Sharma", "Patel", "Reddy",
                "Jain", "Bose", "Das", "Yadav", "Chauhan"};

        List<UserEntity> patientUsers = new ArrayList<>();
        for (int i = 0; i < 25; i++) {
            UserEntity u = new UserEntity();
            u.setEmail("patient" + (i + 1) + "@gmail.com");
            u.setPassword(defaultPassword);
            u.setRole(Role.PATIENT);
            patientUsers.add(u);
        }
        List<UserEntity> savedPatientUsers = userRepository.saveAll(patientUsers);

        List<PatientEntity> patientEntities = new ArrayList<>();
        for (int i = 0; i < 25; i++) {
            PatientEntity p = new PatientEntity();
            p.setUser(savedPatientUsers.get(i));
            p.setName(firstNames[i] + " " + lastNames[random.nextInt(lastNames.length)]);
            p.setEmail("patient" + (i + 1) + "@gmail.com");
            p.setAge(20 + random.nextInt(40));
            p.setGender(i < 15 ? "Male" : "Female");
            p.setPhone("9988776" + String.format("%03d", i));
            patientEntities.add(p);
        }
        List<PatientEntity> savedPatients = patientRepository.saveAll(patientEntities);
        System.out.println("✓ 25 Patients created");

        // ---- 4. Doctor Availability (Next 30 days, 5 slots each) ----
        LocalDate today = LocalDate.now();
        String[] timeSlots = {"09:00 AM - 10:00 AM", "10:30 AM - 11:30 AM",
                "01:00 PM - 02:00 PM", "03:00 PM - 04:00 PM", "05:00 PM - 06:00 PM"};

        List<DoctorAvailEntity> availList = new ArrayList<>();
        for (DoctorEntity doctor : savedDoctors) {
            for (int i = 0; i < 30; i++) {
                String date = today.plusDays(i).toString();
                for (String slot : timeSlots) {
                    DoctorAvailEntity avail = new DoctorAvailEntity();
                    avail.setDoctor(doctor);
                    avail.setDate(date);
                    avail.setTimeSlot(slot);
                    avail.setBooked(false);
                    availList.add(avail);
                }
            }
        }
        List<DoctorAvailEntity> savedAvails = doctorAvailRepository.saveAll(availList);
        System.out.println("✓ " + savedAvails.size() + " Availability slots created");

        // ---- 5. Appointments (30) ----
        List<AppointmentEntity> appointments = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            PatientEntity patient = savedPatients.get(i % savedPatients.size());
            DoctorAvailEntity avail = savedAvails.get(i * 5); // pick spread out slots
            avail.setBooked(true);

            AppointmentEntity appt = new AppointmentEntity();
            appt.setPatientName(patient.getName());
            appt.setDoctorEntity(avail.getDoctor());
            appt.setDate(avail.getDate() + " | " + avail.getTimeSlot());
            appt.setStatus(i % 3 == 0 ? "PENDING" : "CONFIRMED");
            appointments.add(appt);
        }
        appointmentRepository.saveAll(appointments);
        System.out.println("✓ 30 Appointments created");

        // ---- 6. Pharmacy (10 medicines) ----
        String[] medNames = {"Paracetamol 500mg", "Azithromycin 250mg", "Amoxicillin 500mg",
                "Pantoprazole 40mg", "Cough Syrup 100ml", "Vitamin C + Zinc",
                "Cetirizine 10mg", "Aspirin 75mg", "Ibuprofen 400mg", "Metformin 500mg"};
        String[] medCategories = {"Analgesic", "Antibiotic", "Antibiotic", "Antacid", "Syrup",
                "Supplement", "Antihistamine", "Blood Thinner", "Painkiller", "Anti-diabetic"};

        List<PharmacyEntity> medicines = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            PharmacyEntity med = new PharmacyEntity();
            med.setName(medNames[i]);
            med.setCategory(medCategories[i]);
            med.setStock(150 + random.nextInt(350));
            med.setReorderLevel(50);
            med.setExpiryDate(today.plusYears(1).plusMonths(random.nextInt(12)));
            med.setSupplier("PharmaCorp India Pvt. Ltd.");
            med.setBatchNo("BATCH" + (1000 + i));
            med.setUnitPrice(10.0 + random.nextInt(90));
            med.setOrdered(false);
            medicines.add(med);
        }
        pharmacyRepository.saveAll(medicines);
        System.out.println("✓ 10 Medicines added to pharmacy");

        // ---- 7. Invoices (2 bills) ----
        List<InvoiceEntity> invoices = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            InvoiceEntity invoice = new InvoiceEntity();
            invoice.setPatient(savedPatients.get(i));
            invoice.setPaymentStatus(i == 0 ? "PAID" : "PENDING");
            invoice.setFileName("Invoice_" + savedPatients.get(i).getName().replace(" ", "_") + ".pdf");
            invoice.setFileType("application/pdf");
            invoice.setUploadedAt(LocalDateTime.now());
            invoice.setData(("INVOICE_DEMO_" + i).getBytes());
            invoices.add(invoice);
        }
        invoiceRepository.saveAll(invoices);
        System.out.println("✓ 2 Invoices created");

        System.out.println("==========================================");
        System.out.println("DemoDataSeeder: DATA SEEDING COMPLETE! 🚀");
        System.out.println("==========================================");
    }
}
