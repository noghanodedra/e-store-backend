import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public fullName: string;

  @Column({ default: false })
  public active: boolean;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column({ type: 'timestamp' })
  public lastLoggedIn: Date;

  @Column({ default: false })
  public isAdmin: boolean;

  @Column('int', { default: 0 })
  public tokenVersion: number;

  @CreateDateColumn()
  public createdDate: Date;

  @UpdateDateColumn()
  public updatedDate: Date;

  @VersionColumn()
  public version: number;
}
