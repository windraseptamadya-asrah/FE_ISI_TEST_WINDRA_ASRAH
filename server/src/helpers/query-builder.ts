import { SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source";

export default function Query(): SelectQueryBuilder<any> {
  return AppDataSource.createQueryBuilder()
}