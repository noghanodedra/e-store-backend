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
export class Token extends BaseEntity {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column({ nullable: false })
  public email: string;

  @Column({ nullable: false })
  public access: string;

  @Column({ nullable: false })
  public refresh: string;

  @CreateDateColumn()
  public createdDate: Date;

  @UpdateDateColumn()
  public updatedDate: Date;

  @VersionColumn()
  public version: number;
}
