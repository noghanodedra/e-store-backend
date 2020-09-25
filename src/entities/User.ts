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

  @Column({ nullable: false })
  public fullName: string;

  @Column({ nullable: false, default: true })
  public active: boolean;

  @Column({ nullable: false })
  public email: string;

  @Column({ nullable: false, select: false })
  public password: string;

  @Column({ nullable: true })
  public avatarUrl?: string;

  @Column({ type: 'timestamp' })
  public lastLoggedIn: Date;

  @Column({ nullable: false, default: false })
  public isAdmin: boolean;

  @Column('int', { nullable: false, default: 0 })
  public tokenVersion: number;

  @CreateDateColumn()
  public createdDate: Date;

  @UpdateDateColumn()
  public updatedDate: Date;

  @VersionColumn()
  public version: number;
}
