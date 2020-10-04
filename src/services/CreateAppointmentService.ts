import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

interface Request {
    date: Date;
    provider: string;
}

class CreateAppointmentService {
    public async execute({ date, provider }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository
        );
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate
        );

        if (findAppointmentInSameDate) {
            throw new Error('This appointment is already booked');
        }

        const appointment = appointmentsRepository.create({
            provider,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
