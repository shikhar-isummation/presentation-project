/* eslint-disable prettier/prettier */
// src/office.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from '../typeorm/office.entity';
import { HttpStatus, HttpException } from '@nestjs/common';
import { CreateOfficeDto } from './dto/Create.User.dto';
import { UpdateOfficeDto } from './dto/Update.User.dto';
import { Employees } from 'src/typeorm/employees.entity';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,

    @InjectRepository(Employees)
    private employeeRepository: Repository<Employees>,
  ) { }

  async getAllOffices(): Promise<Office[]> {
    //get all office & return it.
    return this.officeRepository.find();
  }

  async deleteOffice(officeCode: number): Promise<any> {
    //officeId not provided to delete office.
    if (!officeCode) {
      throw new HttpException("Please Provide id", HttpStatus.BAD_REQUEST)
    }
    //try to find office for delete if not then threw exception.
    const Office = await this.officeRepository.findOne({ where: { officeCode } });
    if (!Office) {
      throw new HttpException("Not found any Office", HttpStatus.NOT_FOUND);
    }
    //if present then successfully delete.
    await this.officeRepository.delete(officeCode);
    return {
      message: "Office Successfully deleted",
    }
  }

  async findOfficeById(officeCode: number) {
    if (officeCode)
      return this.employeeRepository
        .createQueryBuilder('e')
        .select([
          'e.*',
          'o.*',
        ])
        .leftJoin('offices', 'o', 'o.officeCode = e.officeCode')
        .where('o.officeCode = :officeCode', { officeCode })
        .getRawMany();
    // office Found failure.
    else throw new HttpException("Not found any officeCode, Please Enter Office Code", HttpStatus.NOT_FOUND);

  }

  async registerOffice(newOfficeData: CreateOfficeDto, officeCode: number | any): Promise<any> {
    // find office already exist or not??
    const Office = await this.officeRepository.findOne({ where: { officeCode } });
    if (Office) {
      throw new HttpException("Office already exists", HttpStatus.CONFLICT)
    }
    // createInstance & save at table.
    const newOffice = this.officeRepository.create(newOfficeData);
    this.officeRepository.save(newOffice);
    return {
      message: `Office Successfully Created & office code is ${officeCode}`,
    }
  }


  async updateUser(officeCode: number, updateOffice: UpdateOfficeDto) {
    if (!officeCode) {
      throw new HttpException("Please Provide officeCode", HttpStatus.BAD_REQUEST)
    }
    const Office = await this.officeRepository.findOne({ where: { officeCode } });
    // console.log(Office);
    if (!Office) {
      throw new HttpException("Not found any user", HttpStatus.NOT_FOUND);
    }
    await this.officeRepository.update(officeCode, updateOffice);
    const updatedUser = await this.officeRepository.findOne({ where: { officeCode } });

    return {
      message: "successfully updated user",
      updatedUser: updatedUser
    }
  }

}
