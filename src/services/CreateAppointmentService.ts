import { startOfHour } from "date-fns";

import AppointmentsRepository from "../repositories/AppointmentsRepository";
import Appointment from "../models/Appointment";

interface Request {
    date: Date;
    provider: string;
}

class CreateAppointmentService {
    private appointmentsRepository;

    constructor(appointmentsRepository: AppointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public execute({ date, provider }: Request): Appointment {
        const appointmentDate = startOfHour(date);

        if (this.appointmentsRepository.findByDate(appointmentDate)) {
            throw new Error("This appointment is already booked");
        }

        const appointment = this.appointmentsRepository.create({
            provider,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
